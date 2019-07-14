/*
JSON Schedule Formatter Functions for ScheduleNEU
Alex Takayama

Dependency functions for the main parser and formatter.

Built for use in 'parser.js'
*/

// *rough* data definition:

// class: attr: "string", number: 9999, nupath: [...]
// season is parametrized; should work for any consistent enumeration.
// year: '19', '18', etc.

// accessor functions (used in rest of the functions)

// getClassYear : Class => Number
// gets the year from a class
var getClassYear = (c) => {
  return parseInt(c.year);
}

// getClassSeason : Class => String
// gets the season from a class
var getClassSeason = (c) => {
  return c.season;
}

// BEGIN FUNCTIONS

// getFirstYear : Class[] => Year
// grab the first year a class occurred.
// may return undefined.
exports.getFirstYear = (classes) => {
  let years = classes.map((c) => (getClassYear(c)));
  let lowest = Math.min.apply(null, years);
  return lowest === Infinity ? undefined : lowest;
}

// getNextYear: Year Class[] => Year
// grab the next year a class occurred, after the provided
// may return undefined.
exports.getNextYear = (current, classes) => {
  let years = classes.map((c) => (getClassYear(c)));
  let yearsGreater = years.filter((y) => (y > current));
  let next = Math.min.apply(null, yearsGreater);
  return next === Infinity ? undefined : next;
}

// * NOT exported.
// classesOfYearSeason : Year, Season[], Class[]
// creates an array of the stuff with the matching year and season.
// expects selection to have classes that have a season. 
let classesOfYearSeason = (year, season, classes) => {
  let ofYear = classes.filter((c) => (getClassYear(c) === year));
  let ofYearSeason = ofYear.filter((c) => (getClassSeason(c) === season));
  return ofYearSeason;
}

// makeYear : Year, Season[], Class[]
// make a year array [FL, SP, S1, S2];
exports.makeYear = (year, seasons, classes) => {
  let yearSched = seasons.map((s) => (classesOfYearSeason(year, s, classes)));
  return yearSched;
}

// * NOT exported.
// getLastYear : Class[]
let getLastYear = (classes) => {
  let years = classes.map((c) => (getClassYear(c)));
  let highest = Math.max.apply(null, years);
  return highest === Infinity ? undefined : highest;
}
