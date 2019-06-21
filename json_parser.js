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
const FALL = 'https://searchneu.com/data/v2/getTermDump/neu.edu/201810.json';
const SPRING = 'https://searchneu.com/data/v2/getTermDump/neu.edu/201830.json';

// the filepath locations for storing fall and spring course data.
const FALL_PATH = './201810.json';
const SPRING_PATH = './201830.json';

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
 * @returns {JSON} The resulting JSON.
 */
function getFileAsJson(inputLocation) {
  var data;
  try {
    data = fs.readFileSync(inputLocation);
  } catch (err) {
    console.log("bad file path");
    throw new Error("Error trying to read .json file. bad file path.");
  }
  
  return JSON.parse(data);
}

/**
 * Downloads a file from a specified link, to a specified filepath. Only downloads if file does not exist.
 * @param {String} url The url to download from.
 * @param {String} dest The destination file path.
 * @param {String} cb The callback function.
 */
function download(url, dest, cb) {
  if (fs.existsSync(dest)) {
    console.log("File " + url + " found, skipping download.");
    cb(undefined);
  } else {
    console.log("File " + url + " not found, downloading...");

    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.

        console.log("Download complete.");
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  }
};

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
 * @param {String} attribute The attribute (college abbreviation) of the target course.
 * @param {number} courseNumber The course number of the target course.
 * @returns {Object} The resulting class object (if found).
 */
function getClassData(classMap, termId, attribute, courseNumber) {
  // classes can be accessed by the 'neu.edu/201830/<COLLEGE>/<COURSE_NUMBER>' attribute of each "classmap"
  // 201830 is spring, 201810 is fall.

  let query = 'neu.edu/' + termId + '/' + attribute + '/' + courseNumber;
  return classMap[query];
}

/**
 * Parses the provided JSON file to an output JSON file, organized chronologically.
 * @param {String} inputLocation The target filepath to input from.
 * @param {String} outputLocation The target filepath to output to.
 * @param {JSON} springClassMap The classmap of spring classes.
 * @param {JSON} fallClassMap The classmap of fall classes.
 */
function toSchedule(inputLocation, outputLocation, springClassMap, fallClassMap) {
  // parse the json file
  let audit = getFileAsJson(inputLocation);

  // get the completed, requirements, and otherInfo
  let completed = audit.completed;
  let requirements = audit.requirements;
  let otherInfo = audit.otherInfo;

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

  // test getClassData
  // console.log(getClassData(springClassMap, 201830, 'CS', 2510));

  // the remaining classes to take.
  // needs to be tested.
  let remainingRequirements = getRemainingRequirements(requiredClasses, completedClasses);
  console.log(JSON.stringify(remainingRequirements, null, 2));

  // the output JSON
  var JSONSchedule = JSON.stringify(schedule, null, 2);

  // output the file to ./schedule.json.
  fs.writeFile(outputLocation, JSONSchedule, (err) => {
    if (err) throw err;
    console.log(schedule);
  });

  // somehow convert the rest of the stuff to a schedule. complete with coop cycles? 
  // need to somehow build a tree of the requirements for classes, and then grab from the bottom. 
  // TODO : convert 'requirements' into the rest of the schedule.
}

// run the main program. 
// ensures that spring and fall files are loaded before parsing schedule.
download(SPRING, SPRING_PATH, (err) => {
  if (err) throw err;
  download(FALL, FALL_PATH, (err) => {
    if (err) throw err;

    var springJSON = getFileAsJson(SPRING_PATH);
    var fallJSON = getFileAsJson(FALL_PATH);
    var springClassMap = springJSON.classMap;
    var fallClassMap = fallJSON.classMap;

    // classes can be accessed by the 'neu.edu/201830/<COLLEGE>/<COURSE_NUMBER>' attribute of each "classmap"
    // 201830 is spring, 201810 is fall.
    
    // parse json.
    toSchedule(INPUT,OUTPUT, springClassMap, fallClassMap);
  })
});
   
