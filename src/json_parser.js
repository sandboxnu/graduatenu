/*
JSON Schedule Formatter for ScheduleNEU
Alex Takayama

Converts JSON schedule data to a JSON formatted schedule.

Reads JSON data in from INPUT.
writes JSON schedule data to OUTPUT.

Relies on 'parser_funcs.js'
*/

// input and output paths.
const INPUT = './parsed_audit.json';
const OUTPUT = './schedule.json';

// parsing functions
const parsing = require('./json_funcs.js');
// file reading
const fs = require('fs');

// main method
var main = (inputLocation, outputLocation) => {
  // grab the json file
  var data;
  try {
    data = fs.readFileSync(inputLocation);
  } catch (err) {
    console.log("bad file path");
    throw new Error("Error trying to read .json file. bad file path.")
    // return;
  }

  // parse the json file
  let old = JSON.parse(data);

  // log the things in the json file
  /*
  console.log(old.completed);
  console.log(old.requirements);
  console.log(old.otherInfo);
  */

  // get the completed, requirements, and otherInfo
  let completed = old.completed;
  let requirements = old.requirements;
  let otherInfo = old.otherInfo;

  let completedClasses = completed.classes;

  // seasons constant
  const seasons = ["SP", "S1", "S2", "FL"];

  // START SORTING

  // start at the lowest year
  let currentYear = parsing.getFirstYear(completedClasses);
  let schedule = [];

  // while we have a next year, append the year to a schedule.
  while (currentYear) {
    schedule.push(parsing.makeYear(currentYear, seasons, completedClasses));
    currentYear = parsing.getNextYear(currentYear, completedClasses);
  }

  // output the file to ./schedule.json.
  fs.writeFile(outputLocation, JSON.stringify(schedule, null, 2), (err) => {
    if (err) throw err;
    console.log("success.");
  });

  // somehow convert the rest of the stuff to a schedule. complete with coop cycles? 
  // need to somehow build a tree of the requirements for classes, and then grab from the bottom. 
  // TODO : convert 'requirements' into the rest of the schedule.

  /*
  POTENTIAL CRITERIAS for building schedule:

  coop cycle (spring/fall/none?)
  option for other requirements/objectives (minors)
  when classes are available
  prerequisits for classes

  ADD-ONS:

  "difficulty" of classes (to balance workload)
  suggest classes that overlap with requirements (NUPATH, major, etc.)


  INFORMATION NEEDED: (whether scraped, or from SearchNEU)

  when classes are available
  prerequisites for classes
  "difficulty" of classes - from trace? or by survey
  */
}

// run the main program. 
main(INPUT, OUTPUT);