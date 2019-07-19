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
const INPUT = '../parsed_audit.json';
// the output file path to the JSON file to convert to. 
const OUTPUT = '../schedule.json';

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

/**
 * Provides an array of the links to the classMap files for a specified year.
 * @param {String} year The 4-digit year to retrieve links for
 * @returns {String[]} The strings of the links for the five files.
 */
let getClassMapLinks = year => 
SEASONS.map(season => 'https://searchneu.com/data/v2/getTermDump/neu.edu/' + year + season + '.json');

/**
 * Provides an array of filepath locations to the classMap files based on a provided year.
 * @param {String} year The target year. expected as a string or number. in the form "2019".
 * @returns {String[]} The names of the five files.
 */
let getClassMapFilePaths = year => SEASONS.map(season => '../' + year + season + '.json');

const SEASON_PATHS = SEASONS.map(season => '../' + YEAR + season + '.json');
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
 * Downloads all the files for a specified year, and attaches the produced JSONS to an object.
 * @param {String} year the 4-digit year.
 * @param {Object} classMapParent The parent object to attach classMaps to, under property termId.
 * @returns {Promise} Whether or not the operation succeeded. "success" or "failure"
 */
let addClassMapsOfYear = function(year, classMapParent) {
  let links = getClassMapLinks(year);
  let paths = getClassMapFilePaths(year);
  
  // convert the above into an array of download calls.
  // assume they are the same length.
  let downloads = [];
  for (let i = 0; i < links.length; i += 1) {
    downloads.push(download(links[i], paths[i]));
  }

  // attempt to download everything
  return Promise.all(downloads)
  .then(results => {
    // if the download succeeds, then try and read everything as JSON
    let jsons = paths.map(path => getFileAsJson(path));
    return Promise.all(jsons);
  }, err => {
    // if the download fails, then log the error.
    console.log("error downloading files");
    console.log("err");
    return "failure";
  })
  .then(results => {
    // if reading as JSON succeeds, then add all the JSONS to parent classMap.
    results.forEach(function(item, index, arr) {
      let classMap = item;
      let termId = classMap.termId;
      classMapParent[termId] = classMap;
    });
    return "success";
  }, err => {
    // if reading stuff as JSON fails, then log the error
    console.log("failed reading items as JSON");
    console.log(err);
    return "failure";
  });
}

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

  if (classObj) {
    let query = 'neu.edu/' + classObj.termId + '/' + subject+ '/' + classId;
    return classObj.classMap[query];
  } else {
    return undefined;
  }
  
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
  constructor(numVertices) {
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

  // returns if edge exists in |V|
  hasEdge(from, to) {
    // if both vertices exist, test if edge exists.
    if (this.hasVertex(from) && hasVertex(to)) {
      // does the adjList for "from" contain "to"?
      this.adjList.get(from).forEach(function(item, index, arr) {
        if (to === item) {
          return true;
        }
      });
    }

    // wasn't found, return false;
    return false;
  }
}

// the following functions are for prerequisite parsing. a prerequisite object is defined below:

/**
 * Produces a string of the course's subject followed by classId.
 * @param {Class} course The course to get the code of.
 */
let courseCode = course => ("" + getClassSubject(course) + getClassClassId(course));

/**
 * Filters and simplifies the prereqs each course in remainingRequirements, updating the course.
 * If a prereq does not exist, then it is undefined. Ignores courses marked as "missing"
 * @param {Class[]} completed The completed classes (in SearchNEU format).
 * @param {Class[]} remainingRequirements The remaining requirements (in SearchNEU format).
 * @returns {Class[]} remainingRequirements with each course.prereqs updated.
 */
function filterAndSimplifyPrereqs(completed, remainingRequirements) {

  // a prereq is an object {} and has the following properties:
  // "type": one of "and" or "or"
  // "values": an array [] of course objects or more prereqs

  // a course is an object {} and has the following properties:
  // "classId": 4 digit number in string format. ex "2500"
  // "subject": the course attribute. ex "CS" or "MATH"
  // "missing": if object property exists, then value is true (boolean). 

  /**
   * Recursively filters classes from a provided prerequisite object in SearchNEU format, according to a provided object map.
   * @param {PrereqObj} oldPrereqObj The prereq object to filter old classes from.
   */
  let filterPrereq = function(oldPrereqObj) {
    // if we have no prereqs, skip.
    if (oldPrereqObj === undefined) {
      return undefined;
    }    

    switch(oldPrereqObj.type) {
      case "and":
      return filterAndPrereq(oldPrereqObj);
      case "or":
      return filterOrPrereq(oldPrereqObj);
      default:
      throw "property \"type\" of SearchNEU-style prereq object was not one of \"and\" or \"or\"";
    }
  }

  /**
   * Recursively filters classes from a provided prerequisite object in SearchNEU format, according to a provided object map.
   * Returns undefined if all of the prereq's requirements have been satisfied, indicating the prereq is complete.
   * @param {PrereqObj} andPrereq The AND-type prereq object to filter old classes from.
   */
  let filterAndPrereq = function(andPrereq) {
    let newPrereqObj = {"type": "and","values": []};

    // conditionally add the non-completed prerequisite classes.
    andPrereq.values.forEach(function(course) {
      // if the course is marked as "missing", ignore it.
      if (course.missing) {}
      // if the course has NOT been completed, add it.
      else if ("type" in course) {
        course = filterPrereq(course);
        if (course !== undefined) newPrereqObj.values.push(course);
      }
      else if (!hasBeenCompleted[courseCode(course)]) {
        newPrereqObj.values.push(course);
      }
    });

    // if we filtered them all out, return undefined (no more prereqs!)
    return newPrereqObj.values.length === 0 ? undefined : newPrereqObj;
  }

  /**
   * Recursively filters classes from a provided prerequisite object in SearchNEU format, according to a provided object map.
   * Returns undefined if one of the prereq's requirements have been satisfied, indicating the prereq is complete.
   * @param {PrereqObj} orPrereq The OR-type prereq object to filter old classes from.
   */
  let filterOrPrereq = function(orPrereq) {
    let newPrereqObj = {"type": "or","values": []};
    let completed = false;

    // if any one of the prereqs have been satisfied => return undefined.
    orPrereq.values.forEach(function(course) {
      // if the course is marked as "missing", ignore it.
      if (course.missing) {}
      // else if the course is another course object
      else {
        if ("type" in course) {
          course = filterPrereq(course);
        }

        if (hasBeenCompleted[courseCode(course)] || course === undefined) {
          completed = true;
        }
        else {
          newPrereqObj.values.push(course);
        }
      }
    });

    // if none of the above ran, then return.
    if (completed) {
      return undefined;
    }
    else if (newPrereqObj.values.length === 1) {
      // return newPrereqObj.values[0];
      return {"type":"and", "values":[newPrereqObj.values[0]]};
    }
    else {
      return newPrereqObj;
    }
  }

  // make a look up table for instant indexing:
  let hasBeenCompleted = {};
  
  // mark all the completed courses as completed, in our hashmap object.
  completed.forEach(function(course) {
    hasBeenCompleted[courseCode(course)] = true;
  });

  // update the prereqs of each remaining requirement to its simplified and filtered version.
  remainingRequirements.forEach(function(item, index, array) {
    let course = item;
    course.prereqs = filterPrereq(course.prereqs);
  }); 

  // return the new updated remainingRequirements.
  return remainingRequirements;
}

/**
 * Produces a graph of the provided list of SearchNEU formatted class objects. 
 * Uses class prereqs to create edges. Uses courseCode to name nodes.
 * @param {Class[]} filteredRequirements A list of classes.
 * @returns {Graph} The produced graph, complete with edges.
 */
function createPrerequisiteGraph(filteredRequirements) {

  // make the graph
  // must exist as a reference for the helper functions.
  let graph = new Graph(filteredRequirements.length);

  // add all vertices to the graph.
  // must be added for the helper functions.
  filteredRequirements.forEach(function(course) {
    graph.addVertex(courseCode(course));
  })

  // helper functiosn for doing prereq graph edges.

  /**
   * Checks whether or not the prereq's edges exist in the graph "graph"
   * @param {String} to The classCode of the node to point to
   * @param {PrereqObj} prereq The prerequisite object to add an edge for (maybe).
   * @returns {boolean} true if the full prereq exists in the graph "graph'"
   */
  let doesPrereqExist = function(to, prereq) {
    if (prereq === undefined) {
      return true;
    } 

    if (prereq.type === "and") {
      return doesAndPrereqExist(to, prereq);
    } else if (prereq.type === "or") {
      return doesOrPrereqExist(to, prereq);
    } else {
      throw "prereq not one of and or or";
    }
  }

  /**
   * 
   * @param {String} to The classCode of the node to point to
   * @param {PrereqObj} prereq The prerequisite objec to add an edge for (maybe).
   * @returns {boolean} true if the full prereq exists in the graph "graph"
   */
  let doesAndPrereqExist = function(to, prereq) {

    // make sure each of the values exists.
    prereq.values.forEach(function(item, index, arrY) {
      if ("type" in item) {
        // does the graph contain the entire prereq?
        if (!doesPrereqExist(to, item)) {
          return false;
        }
      } else {
        let from = courseCode(item);

        // does the graph contain an edge?
        if (!graph.hasEdge(from, to)) {
          return false;
        }
      }
    });

    // if we hit this point, everything passed.
    return true;
  }

  /**
   * 
   * @param {String} to The classCode of the node to point to
   * @param {PrereqObj} prereq The prerequisite object to add an edge for (mabye).
   * @returns {boolean} true if the full prerequisite object exists in the graph "graph"
   */
  let doesOrPrereqExist = function(to, prereq) {

    // if any one of the prereqs exists, return true.
    prereq.values.forEach(function(item, index, arr) {
      if ("type" in item) {
        if (doesPrereqExist(to, item)) {
          return true;
        }
      } else {
        let from = courseCode(item);
        if (graph.hasEdge(from, to)) {
          return true;
        }
      }
    });

    // nothing existed, so return false
    return false;
  }

  /**
   * Recursively adds the prereq edges of a prereq object to a graph, for a specified course.
   * @param {String} to The courseCode of the course we are computing prereqs for. Creates edges to here.
   * @param {PrereqObj} prereq The prereq object of the course we are computing prereqs for.
   */
  let markPrereq = function(to, prereq) {
    // if undefined, return
    if (prereq === undefined) {
      return;
    }
    
    if (prereq.type === "and") {
      // if is an AND prereq, mark as AND prereq.
      markAndPrereq(to, prereq);
    } else if (prereq.type === "or") {
      // if is an OR prereq, mark as OR prereq.
      markOrPrereq(to, prereq);
    } else {
      // otherwise throw error.
      throw "prereq was not of either \"and\" or \"or\" type!";
    }
  }
  
  /**
   * Recursively adds the prereq edgese of an AND-type prereq to a graph.
   * @param {String} to The courseCode of the course we are computing prereqs for.
   * @param {PrereqObj} prereq The prerequisite object of the course we are computing prereqs for.
   */
  let markAndPrereq = function(to, prereq) {
    // prereq is guaranteed to NOT be undefined.
    
    // for each of the prereqs, add an edge from the prereq to us.
    prereq.values.forEach(function(course) {
      
      // here, we'd only like to process if we have a defined course
      // if we have another prereq object, we'd like to process after all the other OR objects.
      // this is in an ideal world. perhaps sort the prereqs beforehand for processing order.
      
      if ("type" in course) {
        // if we are another prereq, mark.
        markPrereq(to, course);
      } else {
        // if we are a defined cours, mark.
        let from = courseCode(course);
        graph.addVertex(from);
        graph.addEdge(from, to); 
      }
    });
  }

  /**
   * Recursively adds the prereq edges of the OR-type prereq to a graph
   * @param {String} to The coruseCode of the course we are computing prereqs for. name of the node in the graph.
   * @param {PrereqObj} prereq The prerequisite object of the course we are compting prereqs for.
   */
  let markOrPrereq = function(to, prereq) {
    // prereq guaranteed to NOT be undefined

    let satisfied = false;

    // keep track of indices
    let lastNestedIndex = -1;
    let lastNormalIndex = -1;
    
    // for each of the prereq courses:
    prereq.values.forEach(function(item, index, array) {
      let course = item;
      
      if ("type" in course) {
        // we have a nested prereq. what a pain.
        lastNestedIndex = index;

        // if we already have the prereq, then mark.
        if (doesPrereqExist(to, course)) {
          markPrereq(to, prereq);
          return;
        }
      } else {
        // we have a normal course prereq. yay!
        lastNormalIndex = index;

        let from = courseCode(course);
        
        if (graph.hasVertex(from)) {
          // if we already have the vertex, then mark.
          // exit, or has been fulfilled.
          graph.addEdge(from, to);
          return;
        }
      }
    });
    
    // if none of the courses were satisfied, add the last vertex and edge.
    // we'd prefer to add a normal prereq (non-nested) before a nested.
    if (!satisfied) {
      let from;

      // find the proper index to add.
      if (lastNormalIndex !== -1) {
        from = courseCode(prereq.values[lastNormalIndex]);
      } else if (lastNestedIndex !== -1) {
        from = courseCode(prereq.values[lastNestedIndex]);
      } else {
        throw "empty prereq object!";
      }

      // add the item at the index.
      graph.addVertex(from);
      graph.addEdge(from, to);
    }
  }

  // END HELPER FUNCTIONS

  // begin processing the items.

  // process the "and" prereqs before the "or" prereqs.
  filteredRequirements.forEach(function(item, index, array) {
    let course = item;

    // if prereqs exist and are of type "and", mark them.
    if (course.prereqs && course.prereqs.type === "and") {
      markAndPrereq(courseCode(course), course.prereqs);
    }
  });

  // process the "or" prereqs
  filteredRequirements.forEach(function(item, index, array) {
    let course = item;
    let prereqs = course.prereqs;

    // if the course has no prereqs, then skip.
    if (prereqs === undefined) {
      return;
    }

    // if any of the prereqs have been completed, abort.
    if (prereqs.type === "or") {
      let to = courseCode(course);
      markOrPrereq(courseCode(course), course.prereqs);
    }
  });

  // return the graph
  return graph;
}

/**
 * Adds the required classes to the schedule. Does mutation. Returns void.
 * @param {JSON} schedule The schedule in JSON format.
 * @param {Class[]} completed The completed classes (in SearchNEU format).
 * @param {Class[]} remainingRequirements The remaining requirements (in SearchNEU format).
 */
function addRequired(schedule, completed, remainingRequirements) {
  // precondition: schedule is full up to some point. need to fill with remaining requirements.
  
  // filter and simplify the requirements according to completed classes.
  let newRequirements = filterAndSimplifyPrereqs(completed, remainingRequirements);

  // use those filtered classes to greate a prerequisite edge graph.
  let topo = createPrerequisiteGraph(newRequirements);

  // we should now have a complete graph with edges.
  console.log(topo.adjList);
  
  // perform topological sort/coffman algorithm to produce an ordering with width 4.
  // todo

  // append the produced ordering to the schedule
  // todo
}

/**
 * Parses the provided JSON file to an output JSON file, organized chronologically.
 * @param {String} inputLocation The target filepath to input from.
 * @param {String} outputLocation The target filepath to output to.
 * @param {Object} classMapParent A classMap parent with each classMap under its corresponding termId.
 */
function toSchedule(inputLocation, outputLocation, classMapParent) {
  
  // parse the json file
  let audit = JSON.parse(fs.readFileSync(inputLocation));

  let schedule = 
  {
    completed: {
      classes: []
    }
  };

  /**
   * Attempts to grab searchNEU data for a course, using that course's termId to lookup the corresponding file.
   * If no termId is found, automatically uses the most recent semester on record.
   * May return undefined.
   * @param {Course} course A course object (hopefully).
   */
  let getSearchNEUData = function(course) {
    let classMap = classMapParent[course.termId];
    if (classMap) {
      return getClassData(classMap, getClassSubject(course), getClassClassId(course));  
    } else {
      classMap = classMapParent[classMapParent.mostRecentSemester];
      let data = getClassData(classMap, getClassSubject(course), getClassClassId(course));
      if (data) {
        return data;
      } else {
        console.log("classMap not found for course:\n" + (m => m ? m : JSON.stringify(course, null, 2))(courseCode(course)));
        return undefined;
      }
    }
    
  }
  

  // add the completed classes. this works!
  addCompleted(schedule, audit.completed.classes);
  
  // filter through the completed classes to pull up their data.
  // only keep the stuff with actual results.
  // todo: change this to use the specified year file of a class.
  // ex. HIST1110.termId => '201860' => lookup in '201860.json'
  // currently juse uses '201930' spring 2019 for everything by default.
  // todo: change this to deal with class enums: {"list":["3302", 3308"], "num_required":"1"}
  let completed = audit.completed.classes.map(function(course) {
    if (course) {
      let result = getSearchNEUData(course);
      
      if (result) {
        console.log("data found for: " + courseCode(course));
        return result;
      }
      else {
        console.log("data not found for: " + courseCode(course));
        console.log(course);
        return undefined;
      }
    }
    else {
      console.log("provided is undefined.");
      return undefined;
    }
  }).filter(course => (course && !("list" in course)) ? true : false);

  // get the remaining required classes, in searchNEU format
  let remainingRequirements = getRemainingRequirements(audit.requirements.classes, audit.completed.classes)
  .map(course => getSearchNEUData(course))
  .filter(course => (course && !("list" in course)) ? true : false);

  // add the remaining required classes.
  // note, expects data in SearchNEU format
  addRequired(schedule, completed, remainingRequirements);

  // the output JSON
  let JSONSchedule = JSON.stringify(schedule, null, 2);
  // console.log("schedule: \n" + JSONSchedule);

  // TESTING. REMOVE LATER!
  let allRequired = audit.requirements.classes.map(function(course) {
    if (course) {
      let result = getSearchNEUData(course);
      
      if (result) {
        console.log("data found for: " + courseCode(course));
        return result;
      }
      else {
        console.log("data not found for: " + courseCode(course));
        console.log(course);
        return undefined;
      }
    }
    else {
      console.log("provided is undefined.");
      return undefined;
    }
  }).filter(course => (course && !("list" in course)) ? true : false);

  addRequired(schedule, [], [getSearchNEUData({"subject":"CS", "classId":"3500"})]);
  // END TESTING.
  
  // output the file to ./schedule.json.
  fs.writeFile(outputLocation, JSONSchedule, (err) => {
    if (err) throw err;
  });
}

// run the main program. 
let classMapParent = {};
let years = [2018, 2019];

Promise.all(years.map(year => addClassMapsOfYear(year, classMapParent)))
.then(result => {
  // adds the most recent semester's termId as a property
  let maxYear = Math.max.apply(null, years);
  let maxSeason = Math.max.apply(null, SEASONS);
  classMapParent["mostRecentSemester"] = "" + maxYear + maxSeason;

  // success! now run the main code.
  toSchedule(INPUT, OUTPUT, classMapParent);
}, err => {
  console.log("something went wrong with addClassMapsOfYear");
  console.log(err);
})
