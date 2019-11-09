import {
  Schedule,
  ScheduleCourse,
  INEUAndPrereq,
  INEUOrPrereq,
  ScheduleTerm,
  IInitialScheduleRep,
  INEUCourse,
  ICompleteCourse,
  ScheduleYear,
  Season,
  Status,
  INEUParentMap,
  CourseTakenTracker,
  IWarning,
  IRequiredCourse,
  INEUPrereqCourse,
  IScheduleCourse,
  IOldRequirement,
  INEUClassMap,
} from "../../frontend/src/models/types";

/**
 * This module contains functions that generate warnings based off a schedule input.
 *
 * A Schedule is defined as a 2D list of IScheduleCourses, where the first nested list is a single semester.
 *
 * Functions produce warnings in the same order, where each list corresponds to each semester.
 */

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
  let warnings: IWarning[] = [];

  // for each of the years in schedule, retrieve the corresponding map.
  // smallest to biggest.
  schedule.years.sort((n1, n2) => n1 - n2);
  for (const yearNum of schedule.years) {
    const year = schedule.yearMap[yearNum];

    // check all courses for warnings, and then add them, term by term.
    warnings = warnings.concat(produceAllWarnings(year.fall, tracker));
    addCoursesToTracker(year.fall, tracker);

    warnings = warnings.concat(produceAllWarnings(year.spring, tracker));
    addCoursesToTracker(year.spring, tracker);

    // if is summer full, only check summer I.
    // shouldn't matter, summerII would just be empty.
    if (year.isSummerFull) {
      warnings = warnings.concat(produceAllWarnings(year.summer1, tracker));
      addCoursesToTracker(year.summer1, tracker);
    } else {
      warnings = warnings.concat(produceAllWarnings(year.summer1, tracker));
      addCoursesToTracker(year.summer1, tracker);

      warnings = warnings.concat(produceAllWarnings(year.summer2, tracker));
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
function addCoursesToTracker(
  toAdd: ScheduleTerm,
  tracker: CourseTakenTracker
): void {
  for (const course of toAdd.classes) {
    tracker.addCourse(courseCode(course));
  }
}

/**
 * Produces all warnings for a given course.
 * @param classesToCheck the classes to check
 * @param tracker the course taken tracker
 */
function produceAllWarnings(
  term: ScheduleTerm,
  tracker: CourseTakenTracker
): IWarning[] {
  let warnings: IWarning[] = [];
  warnings = warnings.concat(
    checkPrerequisites(term.classes, tracker, term.termId)
  );
  warnings = warnings.concat(
    checkCorequisites(term.classes, tracker, term.termId)
  );
  warnings = warnings.concat(
    checkSemesterCredits(term.classes, tracker, term.termId)
  );
  warnings = warnings.concat(
    checkSemesterOverload(term.classes, tracker, term.termId)
  );
  return warnings;
}

/**
 * Checks that course prerequisites are met for each semester.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkPrerequisites(
  toCheck: ScheduleCourse[],
  tracker: CourseTakenTracker,
  termId: number
): IWarning[] {
  // the warnings produced.
  const warnings: IWarning[] = [];

  // tracker has all courses taken.
  for (const course of toCheck) {
    if (course.prereqs) {
      let prereqResult = doesPrereqExist(course.prereqs, tracker);
      if (prereqResult) {
        // if prereq doesn't exist, produce a warning.
        warnings.push({
          message: `${courseCode(
            course
          )}: prereqs not satisfied: ${prereqResult}`,
          termId: termId,
        });
      }
    }
  }
  return warnings;
}

/**
 * Checks that course corequisites are met for each semester.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkCorequisites(
  toCheck: ScheduleCourse[],
  tracker: CourseTakenTracker,
  termId: number
): IWarning[] {
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
    },
  };

  // add warnings.
  for (const course of toCheck) {
    coreqTracker.addCourse(courseCode(course));
  }

  // the list of warnings.
  const warnings: IWarning[] = [];

  // check each course.
  for (const course of toCheck) {
    if (course.coreqs) {
      let prereqResult = doesPrereqExist(course.coreqs, coreqTracker);
      if (prereqResult) {
        warnings.push({
          message: `${courseCode(
            course
          )}: coreqs not satisfied: ${prereqResult}`,
          termId: termId,
        });
      }
    }
  }

  return warnings;
}

/**
 * Checks that per-semester credit counts don't exceed 19.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkSemesterCredits(
  toCheck: ScheduleCourse[],
  tracker: CourseTakenTracker,
  termId: number
): IWarning[] {
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
      termId: termId,
    });
  }
  if (minCredits >= 19) {
    warnings.push({
      message: `Enrolled in a min of ${minCredits} credits. May be over-enrolled.`,
      termId: termId,
    });
  }
  return warnings;
}

/**
 * Checks that per-semester 4-credit course counts don't exceed 4.
 * @param schedule The schedule to check.
 * @param tracker tracker for courses taken
 */
function checkSemesterOverload(
  toCheck: ScheduleCourse[],
  tracker: CourseTakenTracker,
  termId: number
): IWarning[] {
  let numFourCrediters = 0;
  for (const course of toCheck) {
    if (course.numCreditsMin >= 4) {
      numFourCrediters += 1;
    }
  }

  if (numFourCrediters > 4) {
    return [
      {
        message: `Overloaded: Enrolled in ${numFourCrediters} four-credit courses.`,
        termId: termId,
      },
    ];
  } else {
    return [];
  }
}

/**
 * converts from old schedule to new schedule
 * @param sched the old schedule.
 */
export function oldToNew(
  old: IInitialScheduleRep,
  parent: INEUParentMap
): Schedule {
  const byTermId: {
    termIds: number[];
    termMap: { [key: number]: ScheduleCourse[] };
  } = {
    termIds: [],
    termMap: {},
  };

  // parse all courses in dude.
  let allCourses: ICompleteCourse[] = [];
  allCourses = allCourses.concat(old.completed.courses);
  allCourses = allCourses.concat(old.inprogress.courses);
  for (const course of allCourses) {
    // if doesn't include termId, add.
    if (!byTermId.termIds.includes(course.termId)) {
      byTermId.termIds.push(course.termId);
      byTermId.termMap[course.termId] = [];
    }

    // get the searchNEU version.
    const detailed: INEUCourse | undefined = getSearchNEUData(course, parent);
    if (detailed) {
      byTermId.termMap[detailed.termId].push({
        classId: detailed.classId,
        subject: detailed.subject,
        prereqs: detailed.prereqs,
        coreqs: detailed.coreqs,
        numCreditsMin: detailed.minCredits,
        numCreditsMax: detailed.maxCredits,
      });
    } else {
      // it probably exists, but might not in the termId.
      const mostRecent: INEUCourse | undefined = getSearchNEUData(
        {
          subject: course.subject,
          classId: course.classId,
        },
        parent
      );

      if (mostRecent) {
        byTermId.termMap[course.termId].push({
          classId: course.classId,
          subject: course.subject,
          prereqs: mostRecent.prereqs,
          coreqs: mostRecent.coreqs,
          numCreditsMin: mostRecent.minCredits,
          numCreditsMax: mostRecent.maxCredits,
        });
      } else {
        byTermId.termMap[course.termId].push({
          classId: course.classId,
          subject: course.subject,
          prereqs: undefined,
          coreqs: undefined,
          numCreditsMin: course.creditHours,
          numCreditsMax: course.creditHours,
        });
      }
    }
  }

  // add to the born child.
  const born: Schedule = {
    years: [],
    yearMap: {},
    id: "example-schedule",
  };

  // get all the years
  let years: number[] = [];
  for (const termId of byTermId.termIds) {
    if (!years.includes(Math.floor(termId / 100))) {
      years.push(Math.floor(termId / 100));
    }
  }

  // create each year object
  for (const year of years) {
    const yearObject: ScheduleYear = {
      year: year,
      fall: {
        season: Season.FL,
        year: year,
        termId: year * 100 + 10,
        id: 10,
        status: Status.INACTIVE,
        classes: [],
      },
      spring: {
        season: Season.SP,
        year: year,
        termId: year * 100 + 30,
        id: 30,
        status: Status.INACTIVE,
        classes: [],
      },
      summer1: {
        season: Season.S1,
        year: year,
        termId: year * 100 + 40,
        id: 40,
        status: Status.INACTIVE,
        classes: [],
      },
      summer2: {
        season: Season.S2,
        year: year,
        termId: year * 100 + 60,
        id: 60,
        status: Status.INACTIVE,
        classes: [],
      },
      isSummerFull: false,
    };

    if (byTermId.termMap[year * 100 + 10]) {
      for (const course of byTermId.termMap[year * 100 + 10]) {
        yearObject.fall.status = Status.CLASSES;
        yearObject.fall.classes.push(course);
      }
    }
    if (byTermId.termMap[year * 100 + 30]) {
      for (const course of byTermId.termMap[year * 100 + 30]) {
        yearObject.spring.status = Status.CLASSES;
        yearObject.spring.classes.push(course);
      }
    }
    if (byTermId.termMap[year * 100 + 40]) {
      for (const course of byTermId.termMap[year * 100 + 40]) {
        yearObject.summer1.status = Status.CLASSES;
        yearObject.summer1.classes.push(course);
      }
    }
    if (byTermId.termMap[year * 100 + 60]) {
      for (const course of byTermId.termMap[year * 100 + 60]) {
        yearObject.summer2.status = Status.CLASSES;
        yearObject.summer2.classes.push(course);
      }
    }
    born.years.push(year);
    born.yearMap[year] = yearObject;
  }

  return born;
}

/**
 * Attempts to grab searchNEU data for a course, using that course's termId to lookup the corresponding file.
 * If no termId is found, automatically uses the most recent semester on record.
 * May return undefined.
 * @param course A course object (hopefully).
 * @param classMapParent The parent classMap object, with props "mostRecentSemester" and "allTermIds"
 * @returns Produces the corresponding searchNEU data for a class, if it exists. else => undefined.
 */
export const getSearchNEUData = (
  course:
    | ICompleteCourse
    | IRequiredCourse
    | INEUCourse
    | INEUPrereqCourse
    | IScheduleCourse
    | IOldRequirement,
  classMapParent: INEUParentMap
): INEUCourse | undefined => {
  /**
   * Grabs the data of a specified class.
   * @param classObj The class object containing a classMap and termId.
   * @param subject The subject (college abbreviation) of the target course.
   * @param classId course number of the target course.
   * @returns The resulting class object (if found).
   */
  function getClassData(
    classObj: INEUClassMap,
    potentialSubject: string,
    potentialClassId: number
  ) {
    // classes can be accessed by the 'neu.edu/201830/<COLLEGE>/<COURSE_NUMBER>' attribute of each "classmap"
    const query =
      "neu.edu/" +
      classObj.termId +
      "/" +
      potentialSubject +
      "/" +
      potentialClassId;
    return classObj.classMap[query];
  }

  // skip doing work if there's no work to do.
  if (!course) {
    return undefined;
  }

  const subject: string | undefined = course.subject;
  const classId: number | undefined = course.classId;
  let termId: number | undefined;
  let classMap: INEUClassMap | undefined;
  if ("termId" in course) {
    termId = course.termId;
    classMap = classMapParent.classMapMap[termId];
  }

  if (classId && subject && termId && classMap) {
    // if everything is valid, then query the classMap
    // console.log("data found for: " + subject + classId);
    return getClassData(classMap, subject, classId);
  } else if (subject && classId && !termId) {
    // if only the subject and classId are valid, guess the termId from most recent => least recent
    const allTermIds = classMapParent.allTermIds;
    for (const currentTermId of allTermIds) {
      classMap = classMapParent.classMapMap[currentTermId];
      const data: INEUCourse | undefined = getClassData(
        classMap,
        subject,
        classId
      );
      if (data) {
        // if the data exists, then return. otherwise keep searching.
        // console.log("data found in term: " + termId + " for course: " + subject + classId);
        return data;
      }
    }
    // if not found, then return undefined
    // console.log("data not found for:");
    // console.log(course);
    return undefined;
  } else {
    // if we have no subject and classId, then we don't even know what course to search for.
    // console.log("data not found for:");
    // console.log(course);
    return undefined;
  }
};

/**
 * Prereq Validation code follows
 */

/**
 * Produces a string of the course's subject followed by classId.
 * @param course The course to get the code of.
 * @returns The courseCode of the course.
 */
export const courseCode = (
  course:
    | ICompleteCourse
    | IRequiredCourse
    | INEUCourse
    | INEUPrereqCourse
    | IScheduleCourse
) => {
  return "" + course.subject + course.classId;
};

/**
 * Checks whether or not the prereq's edges exist in the graph "graph"
 * @param to The classCode of the node to point to
 * @param prereq The prerequisite object to add an edge for (maybe).
 * @returns true if the full prereq exists in the graph "graph'"
 */
export const doesPrereqExist = (
  prereq: INEUAndPrereq | INEUOrPrereq,
  tracker: CourseTakenTracker
): string | undefined => {
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
const doesAndPrereqExist = (
  prereq: INEUAndPrereq,
  tracker: CourseTakenTracker
): string | undefined => {
  // make sure each of the values exists.
  for (const item of prereq.values) {
    if ("type" in item) {
      // does the graph contain the entire prereq?
      let prereqResult = doesPrereqExist(item, tracker);
      if (prereqResult) {
        return `AND: {${prereqResult}}`;
      }
    } else {
      const from = courseCode(item);
      // does the graph contain an edge?
      if (!tracker.contains(courseCode(item))) {
        return `AND: ${courseCode(item)}`;
      }
    }
  }

  // if we hit this point, everything passed.
  return undefined;
};

/**
 *
 * @param to The classCode of the node to point to
 * @param prereq The prerequisite object to add an edge for (mabye).
 * @returns true if the full prerequisite object exists in the graph "graph"
 */
const doesOrPrereqExist = (
  prereq: INEUOrPrereq,
  tracker: CourseTakenTracker
): string | undefined => {
  // if any one of the prereqs exists, return true.
  for (const item of prereq.values) {
    if ("type" in item) {
      let prereqResult = doesPrereqExist(item, tracker);
      if (prereqResult === undefined) {
        return undefined;
      }
    } else {
      if (tracker.contains(courseCode(item))) {
        return undefined;
      }
    }
  }

  // nothing existed, so return false
  return `OR: ${prereq.values.map(function(prereq) {
    if ("type" in prereq) {
      return "{Object}";
    } else {
      return courseCode(prereq);
    }
  })}`;
};
