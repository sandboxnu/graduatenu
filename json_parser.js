/**
 * JSON Schedule Formatter for sandbox/scheduleneu
 * By Alex Takayama
 * 
 * Converts JSON schedule data to a JSON formatted schedule.
 * Relies on 'parser_funcs.js' for helper functions.
 */

const fs = require('fs');

// input file path to JSON file to convert from.
const INPUT = './parsed_audit.json';

// the output file path to the JSON file to convert to. 
const OUTPUT = './schedule.json';

// the possible seasons to choose from.
const SEASONS = ["SP", "S1", "S2", "FL"];

/**
 * Data Definition:
 * Class: attr: "string", number: 999, nupath: [...]
 * Year: '19', '18', etc.
 */

// ACCESSOR FUNCTIONS

/**
 * Gets the year from a class.
 * @param {Class} c The target class.
 */
function getClassYear(c) {
  return parseInt(c.year);
}

/**
 * Gets the season from a class.
 * @param {Class} c The target class.
 */
function getClassSeason(c) {
  return c.season;
}

// PARSING FUNCTIONS

/**
 * Grabs the first year a class occurred. May return undefined if array is empty.
 * @param {Class[]} classes Array of classes from which to grab years from.
 */
function getFirstYear(classes) {
  let years = classes.map((c) => (getClassYear(c)));
  let lowest = Math.min.apply(null, years);
  return lowest === Infinity ? undefined : lowest;
}

/**
 * Grabs the next year a class occurred, after the provided year. May return undefined if array is empty.
 * @param {Year} current The initial year.
 * @param {Class[]} classes Array of classes from which to grab from.
 */
function getNextYear(current, classes) {
  let years = classes.map((c) => (getClassYear(c)));
  let yearsGreater = years.filter((y) => (y > current));
  let next = Math.min.apply(null, yearsGreater);
  return next === Infinity ? undefined : next;
}

/**
 * Filters an array for only the classes with the matching year and season.
 * @param {Year} year The target year.
 * @param {Season} season The target season.
 * @param {Class[]} classes Array of classes from which to grab from.
 */
function classesOfYearSeason(year, season, classes) {
  let ofYear = classes.filter((c) => (getClassYear(c) === year));
  let ofYearSeason = ofYear.filter((c) => (getClassSeason(c) === season));
  return ofYearSeason;
}

/**
 * Maps an array of seasons to the classes taken that year, that season.
 * @param {Year} year The year for which to make the array.
 * @param {Class[]} classes The list of classes to choose from.
 */
function makeYear(year, classes) {
  let yearSched = SEASONS.map((s) => (classesOfYearSeason(year, s, classes)));
  return yearSched;
}

/**
 * Gets the last year classes were taken in the array.
 * @param {Class[]} classes The array of classes to choose from.
 */
function getLastYear(classes) {
  let years = classes.map((c) => (getClassYear(c)));
  let highest = Math.max.apply(null, years);
  return highest === Infinity ? undefined : highest;
}

/**
 * Grabs a file as JSON text.
 * @param {*} inputLocation The filepath of the input file to convert to JSON.
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
 * Parses the provided JSON file to an output JSON file, organized chronologically.
 * @param {*} inputLocation The target filepath to input from.
 * @param {*} outputLocation The target filepath to output to.
 */
function parseJSON(inputLocation, outputLocation) {
  // parse the json file
  let old = getFileAsJson(INPUT);

  // get the completed, requirements, and otherInfo
  let completed = old.completed;
  let requirements = old.requirements;
  let otherInfo = old.otherInfo;

  let completedClasses = completed.classes;

  // start at the lowest year
  let currentYear = getFirstYear(completedClasses);
  let schedule = [];

  // while we have a next year, append the year to a schedule.
  while (currentYear) {
    schedule.push(makeYear(currentYear, completedClasses));
    currentYear = getNextYear(currentYear, completedClasses);
  }

  // output the file to ./schedule.json.
  fs.writeFile(outputLocation, JSON.stringify(schedule, null, 2), (err) => {
    if (err) throw err;
    console.log("success.");
  });

  // somehow convert the rest of the stuff to a schedule. complete with coop cycles? 
  // need to somehow build a tree of the requirements for classes, and then grab from the bottom. 
  // TODO : convert 'requirements' into the rest of the schedule.
}

// run the main program. 
parseJSON(INPUT, OUTPUT);