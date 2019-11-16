import {
  Schedule,
  IWarning,
  CourseTakenTracker,
  ScheduleTerm,
  ScheduleCourse,
  ICompleteCourse,
  IRequiredCourse,
  INEUCourse,
  INEUPrereqCourse,
  IScheduleCourse,
  INEUAndPrereq,
  INEUOrPrereq,
  Major,
  IRequirementGroupWarning,
  IMajorRequirementGroup,
  Requirement,
  ISubjectRange,
  IAndCourse,
  ICourseRange,
  IOrCourse,
  ANDSection,
  ORSection,
  RANGESection,
} from "../models/types";

interface CreditHourTracker {
  hoursCompleted: number;
}

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
 * Identify unsatisfied requirements given a major and a schedule.
 * @param schedule the schedule to check requirements for.
 * @param major the major to check requirements against.
 */
export function produceRequirementGroupWarning(
  schedule: Schedule,
  major: Major
): IRequirementGroupWarning[] {
  // holds courses that are currently on the schedule.
  const taken: Map<string, number> = new Map<string, number>();
  const coursesUsed: Set<string> = new Set<string>();

  //add courses from the schedule to a Map: string => number (produceCourseCode => creditHours)
  schedule.years.sort((n1, n2) => n1 - n2);
  for (const yearNum of schedule.years) {
    const year = schedule.yearMap[yearNum];

    // add courses, term by term.
    addCoursesToMap(year.fall, taken);

    addCoursesToMap(year.spring, taken);

    // if is summer full, only check summer I.
    // shouldn't matter, summerII would just be empty.
    if (year.isSummerFull) {
      addCoursesToMap(year.summer1, taken);
    } else {
      addCoursesToMap(year.summer1, taken);
      addCoursesToMap(year.summer2, taken);
    }
  }

  let requirementGroups: string[] = major.requirementGroups;
  let res: IRequirementGroupWarning[] = [];
  for (const name of requirementGroups) {
    let requirementGroup: IMajorRequirementGroup =
      major.requirementGroupMap[name];
    // todo: if req group is RangeSection or contains a ICourseRange process after all other requirement groups.
    // this is because these reqs can be satisfied by a wide range of courses, and you don't want it using up
    // a course that is need to satisfy a more constrained requirement.
    let unsatisfiedRequirement:
      | IRequirementGroupWarning
      | undefined = produceUnsatifiedRequirement(
      requirementGroup,
      taken,
      coursesUsed
    );
    if (unsatisfiedRequirement) {
      res.push(unsatisfiedRequirement);
    }
  }
  return res;
}

/**
 * Produce an IUnsatisfiedRequirementGroup object if the requirementGroup hasn't been fully satisfied. Undefined otherwise.
 * @param requirementGroup the requirement group to check.
 * @param taken the Map of courses a student has on their schedule right now.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 */
function produceUnsatifiedRequirement(
  requirementGroup: IMajorRequirementGroup,
  taken: Map<string, number>,
  coursesUsed: Set<string>
): IRequirementGroupWarning | undefined {
  switch (requirementGroup.type) {
    case "AND": {
      return processAndSection(requirementGroup, taken, coursesUsed);
    }
    case "OR": {
      return processOrSection(requirementGroup, taken, coursesUsed);
    }
    case "RANGE": {
      return processRangeSection(requirementGroup, taken, coursesUsed);
    }
    default: {
      return undefined;
    }
  }
}

function processAndSection(
  requirementGroup: ANDSection,
  taken: Map<string, number>,
  coursesUsed: Set<string>
): IRequirementGroupWarning | undefined {
  let satisfied: CreditHourTracker = {
    hoursCompleted: 0,
  };
  let messages: string[] = [];
  for (const requirement of requirementGroup.requirements) {
    let message: string | undefined = processRequirement(
      requirement,
      taken,
      satisfied,
      coursesUsed,
      // zero because the credit hours don't matter in an AndSection--need to satisfy all requirements.
      0
    );
    if (message) {
      messages.push(message);
    }
  }

  //if any of the requirements were not satisfied produce warning.
  if (messages.length > 0) {
    let reqGroupMessage: string = `${
      requirementGroup.name
    }: requirement not satisfied: ${messages.join(" AND ")}`;
    let res: IRequirementGroupWarning = {
      message: reqGroupMessage,
      requirementGroup: requirementGroup.name,
    };
    return res;
  } else {
    return undefined;
  }
}

function processOrSection(
  requirementGroup: ORSection,
  taken: Map<string, number>,
  coursesUsed: Set<string>
): IRequirementGroupWarning | undefined {
  let satisfied: CreditHourTracker = {
    hoursCompleted: 0,
  };
  let messages: string[] = [];
  let minCredsRequired: number = requirementGroup.numCreditsMin;
  for (const requirement of requirementGroup.requirements) {
    let message: string | undefined = processRequirement(
      requirement,
      taken,
      satisfied,
      coursesUsed,
      minCredsRequired
    );
    if (message) {
      messages.push(message);
    }

    //if the number of credits has been satisfied, we're good, don't need to look at rest of the requirements
    if (satisfied.hoursCompleted >= minCredsRequired) {
      return undefined;
    }
  }

  if (satisfied.hoursCompleted < minCredsRequired) {
    let reqGroupMessage: string = `${
      requirementGroup.name
    }: requirement not satisfied: need ${minCredsRequired -
      satisfied.hoursCompleted} credits from: ${messages.join(" OR ")}`;
    let res: IRequirementGroupWarning = {
      message: reqGroupMessage,
      requirementGroup: requirementGroup.name,
    };
    return res;
  } else {
    return undefined;
  }
}

function processRangeSection(
  requirementGroup: RANGESection,
  taken: Map<string, number>,
  coursesUsed: Set<string>
): IRequirementGroupWarning | undefined {
  let satisfied: CreditHourTracker = {
    hoursCompleted: 0,
  };
  let messages: string[] = [];
  for (const requirement of requirementGroup.requirements) {
    let message: string | undefined = processRequirement(
      requirement,
      taken,
      satisfied,
      coursesUsed,
      requirementGroup.numCreditsMin
    );
    if (message) {
      messages.push(message);
    }
  }

  // a range section only contains an ICourseRange. So if that wasn't satisfied, simply return the warning generated.
  if (messages.length > 0) {
    let reqGroupMessage: string = `${requirementGroup.name}: requirement not satisfied: ${messages[0]}`;
    let res: IRequirementGroupWarning = {
      message: reqGroupMessage,
      requirementGroup: requirementGroup.name,
    };
    return res;
  } else {
    return undefined;
  }
}

/**
 * Produce a message listing unsatisfied requirements if requirement hasn't been fully satisfied. Undefined otherwise.
 * @param requirement the requirement to check
 * @param taken the Map of courses a student has on their schedule right now
 * @param satisfied a tracker of the hours satisfied for the top-level requirement.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 * @param creditHoursNeeded num hours need to satisfy top-level requirement.
 */
function processRequirement(
  requirement: Requirement,
  taken: Map<string, number>,
  satisfied: CreditHourTracker,
  coursesUsed: Set<string>,
  creditHoursNeeded: number
): string | undefined {
  switch (requirement.type) {
    case "AND": {
      return processIAndCourse(
        requirement,
        taken,
        satisfied,
        coursesUsed,
        creditHoursNeeded
      );
    }
    case "OR": {
      return processIOrCourse(
        requirement,
        taken,
        satisfied,
        coursesUsed,
        creditHoursNeeded
      );
    }
    case "RANGE": {
      return processICourseRange(
        requirement,
        taken,
        satisfied,
        coursesUsed,
        creditHoursNeeded
      );
    }
    // requirement is unsatisfied if doesn't exist in the taken map.
    case "COURSE": {
      return processIRequiredCourse(
        requirement,
        taken,
        satisfied,
        coursesUsed,
        creditHoursNeeded
      );
    }
  }
}

/**
 * Processes an IAndCourse requirement.
 * @param requirement the requirement to check
 * @param taken the Map of courses a student has on their schedule right now
 * @param satisfied a tracker of the hours satisfied for the top-level requirement.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 * @param creditHoursNeeded num hours need to satisfy top-level requirement.
 */
function processIAndCourse(
  requirement: IAndCourse,
  taken: Map<string, number>,
  satisfied: CreditHourTracker,
  coursesUsed: Set<string>,
  creditHoursNeeded: number
): string | undefined {
  // requirement is unsatisfied if even one of the requirements in the list is unsatisfied.
  let processReqMessages: string[] = processRequirementCourses(
    requirement.courses,
    taken,
    satisfied,
    coursesUsed,
    creditHoursNeeded
  );
  if (processReqMessages.length > 0) {
    let reqMessage = `(${processReqMessages.join(" and ")})`;
    return reqMessage;
  } else {
    return undefined;
  }
}

/**
 * Processes an IOrCourse requirement.
 * @param requirement the requirement to check
 * @param taken the Map of courses a student has on their schedule right now
 * @param satisfied a tracker of the hours satisfied for the top-level requirement.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 * @param creditHoursNeeded num hours need to satisfy top-level requirement.
 */
function processIOrCourse(
  requirement: IOrCourse,
  taken: Map<string, number>,
  satisfied: CreditHourTracker,
  coursesUsed: Set<string>,
  creditHoursNeeded: number
): string | undefined {
  // requirement is unsatisfied if all of the requirements in the list have not been satisfied.
  let processReqMessages: string[] = processRequirementCourses(
    requirement.courses,
    taken,
    satisfied,
    coursesUsed,
    creditHoursNeeded
  );
  if (processReqMessages.length === requirement.courses.length) {
    let reqMessage = `(${processReqMessages.join(" or ")})`;
    return reqMessage;
  } else {
    return undefined;
  }
}

/**
 * Processes an ICourseRange requirement.
 * @param requirement the requirement to check
 * @param taken the Map of courses a student has on their schedule right now
 * @param satisfied a tracker of the hours satisfied for the top-level requirement.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 * @param creditHoursNeeded num hours need to satisfy top-level requirement.
 */
function processICourseRange(
  requirement: ICourseRange,
  taken: Map<string, number>,
  satisfied: CreditHourTracker,
  coursesUsed: Set<string>,
  creditHoursNeeded: number
): string | undefined {
  // requirement is unsatisfied if the numCredits for the courseRange hasn't been satisfied.
  let numCreditsrequired: number = requirement.creditsRequired;
  let rangeCreditsCompleted: number = 0;

  //loop through the taken courses and check if it is in one of the subject ranges for this ICourseRange.
  taken.forEach((value: number, key: string) => {
    //check the global map to see if it has not already been used.
    if (!coursesUsed.has(key)) {
      if (courseInSubjectRanges(key, requirement.ranges)) {
        // use the course
        satisfied.hoursCompleted += value;
        coursesUsed.add(key);
        rangeCreditsCompleted += value;
      }
    }
  });

  if (rangeCreditsCompleted >= numCreditsrequired) {
    // ICourseRange satisfied
    return undefined;
  } else {
    return `(complete ${numCreditsrequired -
      rangeCreditsCompleted} credits from ${concatSubjectRanges(
      requirement.ranges
    )})`;
  }
}

/**
 * Processes an IRequiredCourse requirement.
 * @param requirement the requirement to check
 * @param taken the Map of courses a student has on their schedule right now
 * @param satisfied a tracker of the hours satisfied for the top-level requirement.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 * @param creditHoursNeeded num hours need to satisfy top-level requirement.
 */
function processIRequiredCourse(
  requirement: IRequiredCourse,
  taken: Map<string, number>,
  satisfied: CreditHourTracker,
  coursesUsed: Set<string>,
  creditHoursNeeded: number
): string | undefined {
  // requirement is unsatisfied if doesn't exist in the taken map.
  let code: string = produceCourseCode(requirement);
  let creditHours: number | undefined = taken.get(code);
  if (creditHours !== undefined) {
    satisfied.hoursCompleted += creditHours;
    coursesUsed.add(code);
    return undefined;
  } else {
    return code;
  }
}

/**
 * Produce a message for each unsatisfied requirement. Undefined if all requirements in list satisfied.
 * @param requirements list of requirements
 * @param taken the Map of courses a student has on their schedule right now
 * @param satisfied a tracker of the hours satisfied for the top-level requirement.
 * @param coursesUsed a set of courses which already satisfy some requirement for the major.
 * @param creditHoursNeeded num hours need to satisfy top-level requirement.
 */
function processRequirementCourses(
  requirements: Requirement[],
  taken: Map<string, number>,
  satisfied: CreditHourTracker,
  coursesUsed: Set<string>,
  creditHoursNeeded: number
): string[] {
  let res: string[] = [];
  for (const requirement of requirements) {
    let processedReq: string | undefined = processRequirement(
      requirement,
      taken,
      satisfied,
      coursesUsed,
      creditHoursNeeded
    );
    if (processedReq) {
      res.push(processedReq);
    }
    // if credit hours have been satisifed, don't process any other courses in the list.
    // ---bug: Co-reqs have zero credits on the schedule, so creditHoursNeeded will be satisifed with
    // just the primary course--without checking to see if co-req is on the schedule too.
    // ---fix: give co-reqs their respective credit-hours in schedule.
    if (
      creditHoursNeeded !== 0 &&
      satisfied.hoursCompleted >= creditHoursNeeded
    ) {
      break;
    }
  }
  return res;
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
 * Add courses from a ScheduleTerm to a Map of coursecode to creditHours
 * @param toAdd the ScheduleTerm
 * @param taken the Map
 */
function addCoursesToMap(
  toAdd: ScheduleTerm,
  taken: Map<string, number>
): void {
  for (const course of toAdd.classes) {
    taken.set(produceCourseCode(course), course.numCreditsMin);
  }
}

/**
 * Check if a course is in one of the subject ranges
 * @param courseCode the course to check
 * @param ranges the ranges to check against.
 */
function courseInSubjectRanges(
  courseCode: string,
  ranges: ISubjectRange[]
): boolean {
  let splitArr: string[] = courseCode.split(" ");
  if (splitArr.length < 2) {
    return false;
  }

  // is the course in one of the subject ranges?
  let subject: string = splitArr[0];
  let courseID: number = parseInt(splitArr[1]);
  for (const subjRange of ranges) {
    if (
      subjRange.subject === subject &&
      subjRange.idRangeStart <= courseID &&
      courseID <= subjRange.idRangeEnd
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Sting concatenation of subject ranges
 * @param ranges the subject ranges.
 */
function concatSubjectRanges(ranges: ISubjectRange[]): string {
  let res: string[] = [];
  for (const range of ranges) {
    let rangeString: string =
      range.subject +
      " " +
      range.idRangeStart.toString() +
      "-" +
      range.idRangeEnd.toString();
    res.push(rangeString);
  }

  return res.join(" ");
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
    | ScheduleCourse
) => {
  return "" + course.subject + course.classId;
};

/**
 * Produces a string of the course's subject followed by classId separated by a space.
 * @param course The course to get the code of.
 * @returns The courseCode of the course.
 */
export const produceCourseCode = (
  course:
    | ICompleteCourse
    | IRequiredCourse
    | INEUCourse
    | INEUPrereqCourse
    | IScheduleCourse
    | ScheduleCourse
) => {
  return "" + course.subject + " " + course.classId;
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
