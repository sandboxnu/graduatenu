/**
 * JSON Schedule Formatter for sandbox/scheduleneu
 * By Alex Takayama
 * 
 * Converts JSON schedule data to a JSON formatted schedule.
 * Relies on 'parser_funcs.js' for helper functions.
 */

const fs = require('fs');
const https = require('https');

// input file path to JSON file to convert from.
const INPUT = './parsed_audit.json';
// the output file path to the JSON file to convert to. 
const OUTPUT = './schedule.json';

// the year
const YEAR = '2019';

// the possible seasons to choose from.
// note that "years" begin in the fall of the previous year. 
// [Fall, Spring, SummerI, SummerFUll, SummerII]
const SEASONS = ["10", "30", "40", "50", "60"];

const SEASON_LINKS = SEASONS.map(season => 'https://searchneu.com/data/v2/getTermDump/neu.edu/' + YEAR + season + '.json');
// the download links for the fall and spring course data.
const FALL = SEASON_LINKS[0];
const SPRING = SEASON_LINKS[1];
const SUMMER1 = SEASON_LINKS[2];
const SUMMERF = SEASON_LINKS[3];
const SUMMER2 = SEASON_LINKS[4];

const SEASON_PATHS = SEASONS.map(season => './' + YEAR + season + '.json');
// the filepath locations for storing fall and spring course data.
const FALL_PATH = SEASON_PATHS[0];
const SPRING_PATH = SEASON_PATHS[1];
const SUMMER1_PATH = SEASON_PATHS[2];
const SUMMERF_PATH = SEASON_PATHS[3];
const SUMMER2_PATH = SEASON_PATHS[4];

/* Data Definition:
 * Class: subject: "string", classId: "999", termId: "201830", nupath: [...]
 */

// ACCESSOR FUNCTIONS

/**
 * Gets the termId from a class.
 * @param {Class} c The target class.
 * @returns {number} The termId of the class.
 */
function getClassTermId(c) {
  return parseInt(c.termId);
}

/**
 * Gets the subject of a class.
 * @param {Class} c The target class.
 * @returns {String} The subject of the class.
 */
function getClassSubject(c) {
  return c.subject;
}

/**
 * Gets the classId  of a class.
 * @param {Class} c The target class.
 * @returns {number} The classId of the class.
 */
function getClassClassId(c) {
  return parseInt(c.classId);
}

// PARSING FUNCTIONS

/**
 * Grabs the first termId a class occurred. May return undefined if array is empty.
 * @param {Class[]} classes Array of classes from which to grab years from.
 * @returns {number} The first (lowest) termId in the list.
 */
function getFirstTerm(classes) {
  let terms = classes.map((c) => (getClassTermId(c)));
  let lowest = Math.min.apply(null, terms);
  return lowest === Infinity ? undefined : lowest;
}

/**
 * Grabs the next term a class occurred, after the provided term. May return undefined if array is empty.
 * @param {number} current The initial term.
 * @param {Class[]} classes Array of classes from which to grab from.
 * @returns {number} The next lowest termId found in the list.
 */
function getNextTerm(current, classes) {
  let terms = classes.map((c) => (getClassTermId(c)));
  let termsGreater = terms.filter((y) => (y > current));
  let next = Math.min.apply(null, termsGreater);
  return next === Infinity ? undefined : next;
}

/**
 * Filters an array for only the classes with the matching termId.
 * @param {number} termId The termId to filter for.
 * @param {Class[]} classes Array of classes from which to grab from.
 * @returns {Class[]} The classes with the provided termId. 
 */
function getClassesOfTerm(termId, classes) {
  let ofTerm = classes.filter((c) => (getClassTermId(c) === termId));
  return ofTerm;
}

/**
 * Grabs a file as JSON text.
 * @param {String} inputLocation The filepath of the input file to convert to JSON.
 * @returns {Promise} The resulting promise, resolved with the parsed JSON. 
 */
function getFileAsJson(inputLocation) {
  return new Promise(function(resolve, reject) {
    fs.readFile(inputLocation, (err, data) => {
      if (err) reject(err);
      try {
        let parsedJSON = JSON.parse(data);
        resolve(parsedJSON);
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * Downloads a file from a specified link, to a specified filepath. Only downloads if file does not exist.
 * @param {String} url The url to download from.
 * @param {String} dest The destination file path.
 * @returns {Promise} The resulting promise, resolved with "Found" or "Downloaded". 
 */
const download = (url, dest) => new Promise(function(resolve, reject) {
  if (fs.existsSync(dest)) {
    console.log("File " + dest + " found, skipping download.");
    resolve("Found");
  } else {
    console.log("File " + dest + " not found, downloading from " + url);

    let file = fs.createWriteStream(dest);
    let request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(err => {
          if (err) reject(err);
          console.log("Download complete.");
          resolve("Downloaded");
        });  // close() is async
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  }
});

/**
 * Returns if the classList contains the given class, by attr and course #.
 * @param {Class[]} classList The list of classes.
 * @param {Class} c The class to find.
 * @returns {boolean} True if class is found.
 */
function containsClass(classList, c) {
  let targetSubject = getClassSubject(c);
  let targetNumber = getClassClassId(c);
  let filteredSubject = classList.filter((cl) => (getClassSubject(cl) === targetSubject));
  let filteredNumber = filteredSubject.filter((cl) => (getClassClassId(cl) === targetNumber));
  return filteredNumber.length > 0;
}

/**
 * Produces an array of the required classes not taken yet.
 * @param {Class[]} required The remaining classes to take.
 * @param {Class[]} completed The classes completed so far.
 * @returns {Class[]} The required classes not taken yet.
 */
function getRemainingRequirements(required, completed) {
  // keep the classes, if they are NOT in completed.
  let remaining = required.filter((cl) => (!containsClass(completed, cl)));
  return remaining;
}

/**
 * Grabs the data of a specified class.
 * @param {Object} classObj The class object containing a classMap and termId.
 * @param {String} subject The subject (college abbreviation) of the target course.
 * @param {number} classId course number of the target course.
 * @returns {Object} The resulting class object (if found).
 */
function getClassData(classObj, subject, classId) {
  // classes can be accessed by the 'neu.edu/201830/<COLLEGE>/<COURSE_NUMBER>' attribute of each "classmap"
  // 201830 is spring, 201810 is fall.

  let query = 'neu.edu/' + classObj.termId + '/' + subject+ '/' + classId;
  return classObj.classMap[query];
}

/**
 * Adds the completed classes to the schedule. Does mutation. Returns void.
 * @param {JSON} schedule The schedule in JSON format. 
 * @param {Class[]} completedClasses A list of the completed classes.
 */
function addCompleted(schedule, completedClasses) {
  // start at the lowest year
  let currentTerm = getFirstTerm(completedClasses);

  // while we have a next year, append the year to a schedule.
  while (currentTerm) {
    schedule.completed.classes.push({termId: currentTerm, courses: getClassesOfTerm(currentTerm, completedClasses)});
    currentTerm = getNextTerm(currentTerm, completedClasses);
  }
}

// Graph for running topological sort on the prerequisites. 
class Graph {
  // constructor
  Constructor(numVertices) {
    this.numVertices = numVertices;
    this.adjList = new Map();
  }

  // adds a vertex
  addVertex(v) {
    // if the vertex is already added, don't overwrite the data!
    if (!this.hasVertex(v)) {
      this.adjList.set(v, []);
    }
  }

  // adds an edge
  addEdge(v, w) {
    this.adjList.get(v).push(w);
  }

  // returns if vertex exists in |V|
  hasVertex(v) {
    return this.adjList.get(v) !== undefined;
  }
}

/**
 * Adds the required classes to the schedule. Does mutation. Returns void.
 * @param {JSON} schedule The schedule in JSON format.
 * @param {Class[]} completed The completed classes (in SearchNEU format).
 * @param {Class[]} remainingRequirements The remaining requirements (in SearchNEU format).
 */
function addRequired(schedule, completed, remainingRequirements) {
  // precondition: schedule is full up to some point. need to fill with remaining requirements.

  // make a look up table for instant indexing:
  let hasBeenCompleted = {};

  // function to produce the "hashCode" of a class
  let courseCode = course => getClassSubject(course) + getClassClassId(course);

  // mark all the completed courses as completed, in our table object.
  for (let course in completed) {
    hasBeenCompleted[courseCode(course)] = true;
  }

  // a prereq is an object {} and has the following properties:
  // "type": one of "and" or "or"
  // "values": an array [] of course objects
  
  // a course is an object {} and has the following properties:
  // "classId": 4 digit number in string format. ex "2500"
  // "subject": the course attribute. ex "CS" or "MATH"
  // "missing": if object property exists, then value is true (boolean). 

  // corresponding prereqs for each of the courses.
  // either removes or keeps prereq, if it's been completed. changes on "and" or "or" prereq type.
  let allPrereqs = remainingRequirements.map(function(course) {

    // this course's prereqs.
    let coursePrereqObj = course.prereqs;

    // if we have no prereqs, skip.
    if (coursePrereqObj === undefined) {
      return undefined;
    }
    // otherwise, filter out the completed prereqs.
    else {
      let newPrereqObj = 
      {
        "type": coursePrereqObj.type,
        "values": []
      };

      // two cases: the prereq type is one of: "and" "or"
      switch(coursePrereqObj.type) {

        // "and" case: remove all completed courses. check if all removed, then return undefined. else keep.
        case "and":

        // conditionally add the non-completed prerequisite classes.
        for (let course in coursePrereqObj.values) {

          // if the course is marked as "missing", ignore it.
          if (course.missing) {
            continue;
          }
          // if the course has NOT been completed, add it.
          else if (!hasBeenCompleted[courseCode(course)]) {
            newPrereqObj.values.push(course);
          }
        }

        // if all prereqs are satisfied, there are none left.
        if (newPrereqObj === []) {
          return undefined;
        }

        break;
        
        // "or" case: if any prereqs have been satisfied, return undefined. otherwise return unchanged.
        case "or":

        // if any one of the prereqs have been satisfied => return undefined.
        for (let course in coursePrereqObj.values) {

          // if the course is marked as "missing", ignore it.
          if (course.missing) {
            continue;
          }
          // if a course is completed, we are of [or] type so we are complete. return undefined.
          else if (hasBeenCompleted[courseCode(course)]) {
            return undefined;
          }
          // if not complete, add to newPrereqObj
          else {
            newPrereqObj.values.push(course);
          }
        }

        break;

        // in the default case, neither "or" or "and" cases were met. thrown an error.
        default:
        throw "property \"type\" of SearchNEU-style prereq object was not one of \"and\" or \"or\"";
      }

      return newPrereqObj;
    }
  }); 

  // next, make the graph!
  let topo = new Graph(remainingRequirements.length);

  // add remainingRequirements to the graph.
  for (let course in remainingRequirements) {
    topo.addVertex(courseCode(course));
  }

  // add the prerequisite edges.
  // process the "and" prereqs before the "or" prereqs.
  for (let course in remainingRequirements) {
    if (course.prereqs.type === "and") {
      let to = courseCode(course);

      for (let prereq in course.prereqs.values) {
        // ignore missing courses.
        if (prereq.missing) {
          continue;
        }

        let from = courseCode(prereq);
        topo.addVertex(from);
        topo.addEdge(from, to);
      }
    }
  }

  // process the "or" prereqs
  for (let course in remainingRequirements) {
    if (course.prereqs.type === "or") {
      let to = courseCode(course);
      let satisfied = false;

      // for each of the prereq courses:
      for (let prereq in course.prereqs.values) {
        // ignore missing courses.
        if (prereq.missing) {
          continue;
        }

        let from = courseCode(prereq);

        // if any courses are satisfied, add the edge and break.
        if (topo.hasVertex(from)) {
          topo.addEdge(from, to);
          satisfied = true;
          break;
        }
      }

      // if none of the courses were satisfied, add the FIRST vertex and edge.
      if (!satisfied) {
        let from = courseCode(course.prereqs.values[0]);
        topo.addVertex(from);
        topo.addEdge(from, to);
      }
    }
  }

  // we should now have a complete graph with edges.
  console.log(topo.adjList);
  
}

/**
 * Parses the provided JSON file to an output JSON file, organized chronologically.
 * @param {String} inputLocation The target filepath to input from.
 * @param {String} outputLocation The target filepath to output to.
 * @param {Object} spring Spring object, with fields termId and classMap.
 * @param {Object} fall Fall object, with fields termId and classMap.
 */
function toSchedule(inputLocation, outputLocation, spring, fall) {
  // parse the json file
  let audit = JSON.parse(fs.readFileSync(inputLocation));

  let schedule = 
  {
    completed: {
      classes: []
    }
  };

  // helper function to get SearchNEU data for a given course (assumes spring)
  let getSearchNEUData = course => getClassData(spring, getClassSubject(course), getClassClassId(course));
  
  addCompleted(schedule, audit.completed.classes);
  addRequired(
    schedule, 
    audit.completed.classes.map(course => getSearchNEUData(course)), 
    getRemainingRequirements(audit.required.classes, audit.completed.classes)
    .map(course => getSearchNEUData(course)));

  // the output JSON
  let JSONSchedule = JSON.stringify(schedule, null, 2);
  console.log("schedule: \n" + JSONSchedule);

  // output the file to ./schedule.json.
  fs.writeFile(outputLocation, JSONSchedule, (err) => {
    if (err) throw err;
  });
}

// run the main program. 
// ensures that spring and fall files are loaded before parsing schedule.
Promise.all([
  download(SPRING, SPRING_PATH), 
  download(FALL, FALL_PATH),
  download(SUMMER1, SUMMER1_PATH),
  download(SUMMERF, SUMMERF_PATH),
  download(SUMMER2, SUMMER2_PATH)])
.then(results => {
  return Promise.all([
    getFileAsJson(FALL_PATH),
    getFileAsJson(SPRING_PATH),
    getFileAsJson(SUMMER1_PATH),
    getFileAsJson(SUMMERF_PATH),
    getFileAsJson(SUMMER2_PATH)])
},
err => {
  console.log("error downloading files.");
  console.log(err);
})
.then(results => {
  // for now, only take in the fall and spring semester data. 
  toSchedule(INPUT, OUTPUT, results[0], results[1]);
},
err => {
  console.log("error reading files as JSON.");
  console.log(err);
});