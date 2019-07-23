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

// the possible seasons to choose from.
// [Fall, Spring, SummerI, SummerFUll, SummerII]
const SEASONS = ["10", "30", "40", "50", "60"];

// the download links for the fall and spring course data.
const FALL = 'https://searchneu.com/data/v2/getTermDump/neu.edu/2018' + SEASONS[0] + '.json';
const SPRING = 'https://searchneu.com/data/v2/getTermDump/neu.edu/2018' + SEASONS[1] + '.json';
const SUMMER1 = 'https://searchneu.com/data/v2/getTermDump/neu.edu/2018' + SEASONS[2] + '.json';
const SUMMERF = 'https://searchneu.com/data/v2/getTermDump/neu.edu/2018' + SEASONS[3] + '.json';
const SUMMER2 = 'https://searchneu.com/data/v2/getTermDump/neu.edu/2018' + SEASONS[4] + '.json';


// the filepath locations for storing fall and spring course data.
const FALL_PATH = './2018' + SEASONS[0] + '.json';
const SPRING_PATH = './2018' + SEASONS[1] + '.json';
const SUMMER1_PATH = './2018' + SEASONS[2] + '.json';
const SUMMERF_PATH = './2018' + SEASONS[3] + '.json';
const SUMMER2_PATH = './2018' + SEASONS[4] + '.json';

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
 * @returns {Promise} The resulting promise.
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
 * @returns {Promise} The eventual completion or failure of the download. Status either "Found" or "Downloaded". else err.
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
 * @param {JSON} classMap The classMap to get data from.
 * @param {number} termId The termId of the classMap.
 * @param {String} subject The subject (college abbreviation) of the target course.
 * @param {number} classId course number of the target course.
 * @returns {Object} The resulting class object (if found).
 */
function getClassData(classMap, termId, subject, classId) {
  // classes can be accessed by the 'neu.edu/201830/<COLLEGE>/<COURSE_NUMBER>' attribute of each "classmap"
  // 201830 is spring, 201810 is fall.

  let query = 'neu.edu/' + termId + '/' + subject+ '/' + classId;
  return classMap[query];
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
  
  // get the completed, requirements, and otherInfo
  let completed = audit.completed;
  let requirements = audit.requirements;
  let otherInfo = audit.otherInfo;

  // get the completed classes, and required classes
  let completedClasses = completed.classes;
  let requiredClasses = requirements.classes;

  // start at the lowest year
  let currentTerm = getFirstTerm(completedClasses);
  let schedule = {completed: {classes: []}};

  // while we have a next year, append the year to a schedule.
  while (currentTerm) {
    schedule.completed.classes.push({termId: currentTerm, courses: getClassesOfTerm(currentTerm, completedClasses)});
    currentTerm = getNextTerm(currentTerm, completedClasses);
  }

  // the remaining classes to take.
  // needs to be tested.
  let remainingRequirements = getRemainingRequirements(requiredClasses, completedClasses);
  console.log("remaining requirements: \n" + JSON.stringify(remainingRequirements, null, 2));

  // spring and fall termIds
  let springId = spring.termId;
  let fallId = fall.termId;

  // classmaps, as JSON objects.
  let springMap = spring.classMap;
  let fallMap = fall.classMap;

  // convert remainig courses to their detailed counterparts. use spring, because it's more recent.
  remainingRequirements = remainingRequirements.map(function(cl) {
    return getClassData(springMap, springId, getClassSubject(cl), getClassClassId(cl));
  });

  // console.log(getClassData(springMap, springId, "CS", 2550).prereqs);
  // console.log(getClassData(fallMap, fallId, "CS", 2500))


  // the output JSON
  let JSONSchedule = JSON.stringify(schedule, null, 2);
  console.log("schedule: \n" + JSONSchedule);

  // output the file to ./schedule.json.
  fs.writeFile(outputLocation, JSONSchedule, (err) => {
    if (err) throw err;
  });

  // somehow convert the rest of the stuff to a schedule. complete with coop cycles? 
  // need to somehow build a tree of the requirements for classes, and then grab from the bottom. 
  // TODO : convert 'requirements' into the rest of the schedule.
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
  toSchedule(INPUT, OUTPUT, results[0], results[1]);
},
err => {
  console.log("error reading files as JSON.");
  console.log(err);
});