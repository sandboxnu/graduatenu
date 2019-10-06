import { Schedule, ScheduleCourse, INEUAndPrereq, INEUOrPrereq, ScheduleTerm } from "./types";
import { courseCode } from "./json_parser";

/**
 * This module contains functions that generate warnings based off a schedule input.
 *
 * A Schedule is defined as a 2D list of IScheduleCourses, where the first nested list is a single semester.
 *
 * Functions produce warnings in the same order, where each list corresponds to each semester.
 */

 /**
  * A Warning.
  */
interface IWarning {
    message: string;
    termId: number;
}

/**
 * Given the {@function courseCode} returns true if the course has been taken.
 */
interface CourseTakenTracker {
  contains: (input: string) => boolean;
  addCourses: (toAdd: string[]) => void;
  addCourse: (toAdd: string) => void;
}

/**
* Checks whether or not the prereq's edges exist in the graph "graph"
* @param to The classCode of the node to point to
* @param prereq The prerequisite object to add an edge for (maybe).
* @returns true if the full prereq exists in the graph "graph'"
*/
const doesPrereqExist = (prereq: INEUAndPrereq | INEUOrPrereq, tracker: CourseTakenTracker): boolean => {
  // if prereq is "and", check and.
  if (prereq.type === "and") {
      return doesAndPrereqExist(prereq, tracker);
  } else {
      return doesOrPrereqExist(prereq, tracker);
  }
};

/**
*
* @param to The classCode of the node to point to
* @param prereq The prerequisite objec to add an edge for (maybe).
* @returns true if the full prereq exists in the graph "graph"
*/
const doesAndPrereqExist = (prereq: INEUAndPrereq, tracker: CourseTakenTracker): boolean => {
  // make sure each of the values exists.
  for (const item of prereq.values) {
      if ("type" in item) {
          // does the graph contain the entire prereq?
          if (!doesPrereqExist(item, tracker)) {
              return false;
          }
      } else {
          const from = courseCode(item);
          
          // does the graph contain an edge?
          if (!tracker.contains(courseCode(item))) {
              return false;
          }
      }
  }
  
  // if we hit this point, everything passed.
  return true;
};

/**
*
* @param to The classCode of the node to point to
* @param prereq The prerequisite object to add an edge for (mabye).
* @returns true if the full prerequisite object exists in the graph "graph"
*/
const doesOrPrereqExist = (prereq: INEUOrPrereq, tracker: CourseTakenTracker): boolean => {
  // if any one of the prereqs exists, return true.
  for (const item of prereq.values) {
      if ("type" in item) {
          if (doesPrereqExist(item, tracker)) {
              return true;
          }
      } else {
          const from = courseCode(item);
          if (tracker.contains(courseCode(item))) {
              return true;
          }
      }
  }
  
  // nothing existed, so return false
  return false;
};

/**
 * Produces warnings for a schedule.
 * @param schedule the schedule
 */
export function produceWarnings(schedule: Schedule): IWarning[] {

  // holds courses that are taken.
  const taken: Set<string> = new Set();
  // custom tracker
  const tracker: CourseTakenTracker = {
    contains: (courseCode: string) => taken.has(courseCode),
    addCourse: (toAdd: string) => {
      taken.add(toAdd);
    },
    addCourses: (toAdd: string[]) => {
      for (const course of toAdd) {
        taken.add(course);
      }
    },

  };

  // list of warnings
  const warnings: IWarning[] = [];

  // for each of the years in schedule, retrieve the corresponding map.
  for (const yearNum of schedule.years) {
    const year = schedule.yearMap[yearNum];

    // check all courses for warnings, and then add them, term by term.
    warnings.concat(produceAllWarnings(year.fall, tracker));
    addCoursesToTracker(year.fall, tracker);

    warnings.concat(produceAllWarnings(year.spring, tracker));
    addCoursesToTracker(year.spring, tracker);
    
    // if is summer full, only check summer I.
    // shouldn't matter, summerII would just be empty.
    if (year.isSummerFull) {
      warnings.concat(produceAllWarnings(year.summer1, tracker));
      addCoursesToTracker(year.summer1, tracker);
    } else {
      warnings.concat(produceAllWarnings(year.summer1, tracker));
      addCoursesToTracker(year.summer1, tracker);

      warnings.concat(produceAllWarnings(year.summer2, tracker));
      addCoursesToTracker(year.summer2, tracker);
    
    }
  }

  // return the warnings.
  return warnings;
}

/**
 * adds {@type ScheduleCourse}s to a tracker. 
 * @param toAdd courses to add
 * @param tracker tracker to add to
 */
function addCoursesToTracker(toAdd: ScheduleTerm, tracker: CourseTakenTracker): void {
  for (const course of toAdd.classes) {
    tracker.addCourse(courseCode(course));
  }
}

/**
 * Produces all warnings for a given course.
 * @param classesToCheck the classes to check
 * @param tracker the course taken tracker
 */
function produceAllWarnings(term: ScheduleTerm, tracker: CourseTakenTracker): IWarning[] {
  const warnings: IWarning[] = [];
  warnings.concat(checkPrerequisites(term.classes, tracker, term.termId));
  warnings.concat(checkCorequisites(term.classes, tracker, term.termId));
  warnings.concat(checkSemesterCredits(term.classes, tracker, term.termId));
  warnings.concat(checkSemesterOverload(term.classes, tracker, term.termId));
  return warnings;
  
}

/**
 * Checks that course prerequisites are met for each semester.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkPrerequisites(toCheck: ScheduleCourse[], tracker: CourseTakenTracker, termId: number): IWarning[] {
  // the warnings produced.
  const warnings: IWarning[] = [];

    // tracker has all courses taken.
    for (const course of toCheck) {
      if (!doesPrereqExist(course.prereqs, tracker)) {
        // if prereq doesn't exist, produce a warning.
        warnings.push({
          message: `${courseCode(course)}: prereqs not satisfied.`,
          termId: termId
        });
      }
    }
    return warnings;
}

/**
 * Checks that course corequisites are met for each semester.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkCorequisites(toCheck: ScheduleCourse[], tracker: CourseTakenTracker, termId: number): IWarning[] {

  // construct the tracker.
    const coreqSet: Set<string> = new Set();
    const coreqTracker: CourseTakenTracker = {
      contains: (code: string) => coreqSet.has(code),
      addCourses: function(courses: string[]): void {
        for (const course of courses) {
          coreqSet.add(course);
        }
      },
      addCourse: function(course: string): void {
        coreqSet.add(course);
      }
    };

    // add warnings.
    for (const course of toCheck) {
      coreqTracker.addCourse(courseCode(course));
    }

    // the list of warnings.
    const warnings: IWarning[] = [];

    // check each course.
    for (const course of toCheck) {
      if (!doesPrereqExist(course.coreqs, coreqTracker)) {
        warnings.push({
          message: `${courseCode(course)}: coreqs not satisfied.`,
          termId: termId,
        });
      }
    }

    return warnings;
}

/**
 * Checks that per-semester credit counts don't exceed 19.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkSemesterCredits(toCheck: ScheduleCourse[], tracker: CourseTakenTracker, termId: number): IWarning[] {
    
  let maxCredits = 0;
  let minCredits = 0;
  for (const course of toCheck) {
    maxCredits += course.numCreditsMax;
    minCredits += course.numCreditsMin;
  }

  const warnings: IWarning[] = [];
  if (maxCredits >= 19) {
    warnings.push({
      message: `Enrolled in a max of ${maxCredits} credits. May be over-enrolled.`,
      termId: termId
    });
  }
  if (minCredits >= 19) {
    warnings.push({
      message: `Enrolled in a min of ${minCredits} credits. May be over-enrolled.`,
      termId: termId
    });
  }
    return warnings;
}

/**
 * Checks that per-semester 4-credit course counts don't exceed 4.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkSemesterOverload(toCheck: ScheduleCourse[], tracker: CourseTakenTracker, termId: number): IWarning[] {
    let numFourCrediters = 0;
    for (const course of toCheck) {
      if (course.numCreditsMin >= 4) {
        numFourCrediters += 1;
      }
    }

    if (numFourCrediters > 4) {
      return [{
        message: `Overloaded: Enrolled in ${numFourCrediters} four-credit courses.`,
        termId: termId,
      }]
    } else {
      return [];
    }
    
}
