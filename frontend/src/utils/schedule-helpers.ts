import {
  CourseWarning,
  DNDSchedule,
  DNDScheduleCourse,
  DNDScheduleTerm,
  DNDScheduleYear,
  SeasonEnum,
  StatusEnum,
} from "../models/types";
import { Schedule, ScheduleCourse, SeasonWord } from "../../../common/types";
import { findExamplePlanFromCoopCycle } from "./plan-helpers";
import { deepCopy } from "./deepCopy";

export function generateBlankCoopPlan(
  major: string,
  coopCycle: string,
  allPlans: Record<string, Schedule[]>
): [DNDSchedule, number] {
  const currentPlan = findExamplePlanFromCoopCycle(allPlans, major, coopCycle);
  let [schedule, counter] = convertToDNDSchedule(currentPlan!, 0);
  return [clearSchedule(schedule), counter]; // clear all courses from example plan
}

export function generateInitialSchedule(
  academicYear: number,
  graduationYear: number,
  completedCourses: ScheduleCourse[],
  major: string,
  coopCycle: string,
  allPlans: Record<string, Schedule[]>
): [DNDSchedule, number] {
  const [schedule, counter] = generateBlankCoopPlan(major, coopCycle, allPlans);
  const [dndCourses, courseCounter] = convertToDNDCourses(
    completedCourses,
    counter
  );

  // add in completed courses
  let year = schedule.years[0];
  while (
    dndCourses.length > 0 &&
    year <= schedule.years[schedule.years.length - 1]
  ) {
    schedule.yearMap[year].fall.classes = dndCourses.splice(0, 4); // the first 4 courses in the list, and remove them from the list
    schedule.yearMap[year].spring.classes = dndCourses.splice(0, 4);
    schedule.yearMap[year].summer1.classes = dndCourses.splice(0, 4);
    schedule.yearMap[year].summer2.classes = dndCourses.splice(0, 4);
  }

  return [
    alterScheduleToHaveCorrectYears(schedule, academicYear, graduationYear),
    courseCounter,
  ];
}

/**
 * Generates a course schedule with completed courses in their appropriate semesters
 * with a co-op cycle and the remaining years blank.
 * @param completedCourseSchedule is the schedule generated using only the student's
 * completed courses
 * @param coopCycle is the pattern of co-ops
 */
export function generateBlankCompletedCourseSchedule(
  academicYear: number,
  graduationYear: number,
  completedCourseSchedule: DNDSchedule,
  major: string,
  coopCycle: string,
  allPlans: Record<string, Schedule[]>
) {
  const [schedule, counter] = generateBlankCoopPlan(major, coopCycle, allPlans);
  const yearCorrectedSchedule = alterScheduleToHaveCorrectYears(
    schedule,
    academicYear,
    graduationYear
  );

  completedCourseSchedule.years.forEach(year => {
    yearCorrectedSchedule.yearMap[year] = completedCourseSchedule.yearMap[year];
  });

  return yearCorrectedSchedule;
}

export function generateYearlessSchedule(
  dndCourses: DNDScheduleCourse[],
  numYears: number
) {
  let yearMap: { [key: number]: DNDScheduleYear } = {};
  const yearsList = [];

  for (let i = 0; i < numYears; i++) {
    const y = 1000 + i;
    yearsList.push(y);
    yearMap[y] = {
      year: y,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: y,
        termId: Number(String(y) + String(10)),
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
      spring: {
        season: SeasonEnum.SP,
        year: y,
        termId: Number(String(y) + String(30)),
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
      summer1: {
        season: SeasonEnum.S1,
        year: y,
        termId: Number(String(y) + String(40)),
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
      summer2: {
        season: SeasonEnum.S2,
        year: y,
        termId: Number(String(y) + String(60)),
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
    };
  }

  return {
    years: yearsList,
    yearMap,
  };
}

export function generateInitialScheduleNoCoopCycle(
  academicYear: number,
  graduationYear: number,
  completedCourses: ScheduleCourse[]
): [DNDSchedule, number] {
  const numYears = 4; // default is 4 years

  const [dndCourses, courseCounter] = convertToDNDCourses(completedCourses, 0);

  const schedule = generateYearlessSchedule(dndCourses, numYears);

  return [
    alterScheduleToHaveCorrectYears(schedule, academicYear, graduationYear),
    courseCounter,
  ];
}

/**
 * Generates a course schedule with completed courses in their appropriate semesters,
 * with remaining years blank and no co-op cycle.
 * @param completedCourseSchedule is the schedule generated using only the student's
 * completed courses
 */
export function generateBlankCompletedCourseScheduleNoCoopCycle(
  academicYear: number,
  graduationYear: number,
  completedCourseSchedule: DNDSchedule
) {
  const currentCalendarYear = new Date().getFullYear();
  const currentYear =
    new Date().getMonth() <= 8 ? currentCalendarYear : currentCalendarYear + 1;
  const numYearsInSchool = graduationYear - currentYear + academicYear;
  const yearsTaken = completedCourseSchedule.years.length;
  const yearsLeft = numYearsInSchool - yearsTaken;

  const mostRecentYear =
    yearsTaken !== 0
      ? completedCourseSchedule.years[yearsTaken - 1]
      : graduationYear - yearsLeft + 1;
  const completedCourseScheduleCopy = deepCopy(
    completedCourseSchedule
  ) as Schedule;
  for (let i = 1; i <= yearsLeft; i++) {
    const currentYear = mostRecentYear + i;
    completedCourseScheduleCopy.years.push(currentYear);
    completedCourseScheduleCopy.yearMap[currentYear] = {
      year: mostRecentYear + i,
      fall: {
        season: "FL",
        year: currentYear,
        termId: Number(String(currentYear) + "10"),
        status: "CLASSES",
        classes: [],
      },
      spring: {
        season: "SP",
        year: currentYear,
        termId: Number(String(currentYear) + "30"),
        status: "CLASSES",
        classes: [],
      },
      summer1: {
        season: "S1",
        year: currentYear,
        termId: Number(String(currentYear) + "40"),
        status: "INACTIVE",
        classes: [],
      },
      summer2: {
        season: "S2",
        year: currentYear,
        termId: Number(String(currentYear) + "60"),
        status: "INACTIVE",
        classes: [],
      },
      isSummerFull: false,
    };
  }

  return convertToDNDSchedule(completedCourseScheduleCopy, 0)[0];
}

export function generateInitialScheduleFromExistingPlan(
  academicYear: number,
  graduationYear: number,
  major: string,
  coopCycle: string,
  allPlans: Record<string, Schedule[]>
): [DNDSchedule, number] {
  const currentPlan = allPlans[major].find(
    (p: Schedule) => planToString(p) === coopCycle
  );
  let [schedule, courseCounter] = convertToDNDSchedule(currentPlan!, 0);
  // set correct year numbers
  schedule = alterScheduleToHaveCorrectYears(
    schedule,
    academicYear,
    graduationYear
  );

  return [schedule, courseCounter];
}
/*
Modifies schedule years to be correct based on academic and graduation year.
School years in the schedule are based on the ending year. For example, the 2019
- 2020 school year is all represented by 2020. 
 */
export function alterScheduleToHaveCorrectYears(
  schedule: DNDSchedule,
  academicYear: number,
  graduationYear: number
): DNDSchedule {
  const currentCalendarYear = new Date().getFullYear();
  // Starting in September, students move up in academic year
  const currentYear =
    new Date().getMonth() <= 8 ? currentCalendarYear : currentCalendarYear + 1;
  const numYearsInSchool = graduationYear - currentYear + academicYear;
  const startingYear = graduationYear - numYearsInSchool + 1;

  const newYearMap: { [key: number]: DNDScheduleYear } = {};
  const newYears: number[] = [];

  for (let i = 0; i < schedule.years.length; i++) {
    const newYear = startingYear + i;
    newYears.push(newYear);

    const oldYear = schedule.years[i];
    newYearMap[newYear] = schedule.yearMap[oldYear];
    newYearMap[newYear].fall.termId = Number(String(newYear) + String(10));
    newYearMap[newYear].fall.year = newYear;
    newYearMap[newYear].spring.termId = Number(String(newYear) + String(30));
    newYearMap[newYear].spring.year = newYear;
    newYearMap[newYear].summer1.termId = Number(String(newYear) + String(40));
    newYearMap[newYear].summer1.year = newYear;
    newYearMap[newYear].summer2.termId = Number(String(newYear) + String(60));
    newYearMap[newYear].summer2.year = newYear;
  }

  return {
    years: newYears,
    yearMap: newYearMap,
  };
}

export function convertTermIdToSeason(termId: number): SeasonWord {
  const seasonId = termId % 100;

  if (seasonId === 10) {
    return "fall";
  }
  if (seasonId === 30) {
    return "spring";
  }
  if (seasonId === 40) {
    return "summer1";
  }
  return "summer2";
}

export function convertTermIdToSeasonString(termId: number): string {
  const seasonId = termId % 100;

  if (seasonId === 10) {
    return "Fall";
  }
  if (seasonId === 30) {
    return "Spring";
  }
  if (seasonId === 40) {
    return "Summer 1";
  }
  return "Summer 2";
}

export function convertSeasonToTermId(season: SeasonEnum): number {
  if (season === SeasonEnum.FL) {
    return 10;
  } else if (season === SeasonEnum.SP) {
    return 30;
  } else if (season === SeasonEnum.S1) {
    return 40;
  }
  return 60;
}

export function convertTermIdToYear(termId: number): number {
  return Math.trunc(termId / 100);
}

export function getCreditsTakenInSchedule(schedule: DNDSchedule): number {
  return schedule.years.reduce((acc: number, year: number) => {
    return (
      acc +
      sumCreditsInSemester(schedule, year, "fall") +
      sumCreditsInSemester(schedule, year, "spring") +
      sumCreditsInSemester(schedule, year, "summer1") +
      sumCreditsInSemester(schedule, year, "summer2")
    );
  }, 0);
}

export function sumCreditsInSemester(
  schedule: DNDSchedule,
  year: number,
  season: string
): number {
  return (schedule.yearMap[year] as any)[season].classes.reduce(
    (acc: number, curr: DNDScheduleCourse) => acc + curr.numCreditsMax,
    0
  );
}

export function sumCreditsFromCourses(courses: ScheduleCourse[]): number {
  return courses.reduce(
    (acc: number, curr: ScheduleCourse) => acc + curr.numCreditsMax,
    0
  );
}

export function getNumCoops(schedule: Schedule): number {
  var num = 0;
  for (const year of schedule.years) {
    const yearSch = schedule.yearMap[year];
    if (yearSch.fall.status === "COOP" || yearSch.spring.status === "COOP") {
      num++;
    }
  }
  return num;
}

export function planToString(plan: Schedule): string {
  return `${plan.years.length} Years, ${getNumCoops(plan)} Co-ops, ${
    isSpringCycle(plan) ? "Spring" : "Fall"
  } Cycle`;
}

export function isSpringCycle(schedule: Schedule): boolean {
  for (const year of schedule.years) {
    const yearSch = schedule.yearMap[year];
    if (yearSch.fall.status === "COOP") {
      return false;
    }
    if (yearSch.spring.status === "COOP") {
      return true;
    }
  }

  // should never happen
  return false;
}

export const convertToDNDSchedule = (
  schedule: Schedule,
  counter: number
): [DNDSchedule, number] => {
  const newSchedule = deepCopy(schedule) as DNDSchedule;
  for (const year of Object.keys(schedule.yearMap)) {
    var result = convertToDNDCourses(
      newSchedule.yearMap[year as any].fall.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].fall.classes = result[0];
    counter = result[1];

    result = convertToDNDCourses(
      newSchedule.yearMap[year as any].spring.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].spring.classes = result[0];
    counter = result[1];

    result = convertToDNDCourses(
      newSchedule.yearMap[year as any].summer1.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].summer1.classes = result[0];
    counter = result[1];

    result = convertToDNDCourses(
      newSchedule.yearMap[year as any].summer2.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].summer2.classes = result[0];
    counter = result[1];
  }
  return [newSchedule, counter];
};

export const clearSchedule = (schedule: DNDSchedule) => {
  const yearMapCopy = deepCopy(schedule.yearMap);
  for (const y of schedule.years) {
    const year = deepCopy(schedule.yearMap[y]);
    year.fall.classes = [];
    year.spring.classes = [];
    year.summer1.classes = [];
    year.summer2.classes = [];
    yearMapCopy[y] = year;
  }

  const newSchedule: DNDSchedule = {
    yearMap: yearMapCopy,
    years: schedule.years,
  };

  return newSchedule;
};

/**
 * Fill in the empty schedule using the previous schedule and the cache
 * for the fifth year. Used to persist schedule when the co-op cycle for a plan
 * is changed.
 * @param previousSchedule the schedule prior to the switch in co-op cycle
 * @param currentSchedule the new empty schedule
 * @param fifthYearCache the most recent 5th year schedule planned by the user
 * which is useful for populating the 5th year if the user is swithing back
 * to a 5 year plan from 4 years.
 */
export const fillInSchedule = (
  previousSchedule: DNDSchedule,
  currentSchedule: DNDSchedule,
  fifthYearCache: DNDScheduleYear
): {
  filledInSchedule: DNDSchedule;
  updatedFifthYearCache?: DNDScheduleYear;
} => {
  // copy over the first 4 years from previous schedule into current schedule
  const filledInYearMap = deepCopy(currentSchedule.yearMap);
  for (let i = 0; i < 4; i++) {
    const yearNum = previousSchedule.years[i];
    const yearCopy = deepCopy(previousSchedule.yearMap[yearNum]);
    filledInYearMap[yearNum] = yearCopy;
  }

  // use and update the fifth year cache if needed
  const previousScheduleYears = previousSchedule.years.length;
  const currentScheduleYears = currentSchedule.years.length;

  // if there is a 5th year in the previous schedule and in the current schedule, copy it over
  if (previousScheduleYears === 5 && currentScheduleYears === 5) {
    const fifthYear = previousSchedule.years[4];
    const fifthYearSceduleCopy = deepCopy(previousSchedule.yearMap[fifthYear]);
    filledInYearMap[fifthYear] = fifthYearSceduleCopy;
  }

  // if there is a 5th year in the previous schedule but not in the current schedule, copy into cache
  let updatedFifthYearCache: DNDScheduleYear | undefined = undefined;
  if (previousScheduleYears === 5 && currentScheduleYears === 4) {
    const fifthYear = previousSchedule.years[4];
    updatedFifthYearCache = deepCopy(previousSchedule.yearMap[fifthYear]);
  }

  // if the previous schedule is 4 years but current schedule is 5 years, then copy 5th year from cache
  if (previousScheduleYears === 4 && currentScheduleYears === 5) {
    if (fifthYearCache) {
      const fifthYear = currentSchedule.years[4];
      const fifthYearCacheCopy = deepCopy(fifthYearCache);
      filledInYearMap[fifthYear] = fifthYearCacheCopy;
    }
  }

  const filledInSchedule: DNDSchedule = {
    yearMap: filledInYearMap,
    years: currentSchedule.years,
  };

  return { filledInSchedule, updatedFifthYearCache };
};

export const convertToDNDCourses = (
  courses: ScheduleCourse[],
  counter: number
): [DNDScheduleCourse[], number] => {
  const list: DNDScheduleCourse[] = [];
  for (const course of courses) {
    counter++;
    list.push({
      ...course,
      dndId: String(
        course.subject.toUpperCase() + " " + course.classId + " " + counter
      ),
    });
  }
  return [list, counter];
};

export function isCoopOrVacation(currSemester: DNDScheduleTerm): boolean {
  return currSemester.status.includes("HOVER");
}

export function scheduleHasClasses(schedule: Schedule): boolean {
  for (const y of schedule.years) {
    const year = schedule.yearMap[y];
    if (
      year.fall.classes.length !== 0 ||
      year.spring.classes.length !== 0 ||
      year.summer1.classes.length !== 0 ||
      year.summer2.classes.length !== 0
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the course strings of every completed course in the given schedule.
 * @param schedule the given schedule to parse
 */
export function getCompletedCourseStrings(schedule: DNDSchedule): string[] {
  let fulfilled: string[] = [];

  for (const y of schedule.years) {
    const year: DNDScheduleYear = schedule.yearMap[y];

    if (year.fall.status !== "INACTIVE") {
      for (const course of year.fall.classes) {
        fulfilled.push(course.subject + course.classId);
      }
    }

    if (year.spring.status !== "INACTIVE") {
      for (const course of year.spring.classes) {
        fulfilled.push(course.subject + course.classId);
      }
    }

    if (year.summer1.status !== "INACTIVE") {
      for (const course of year.summer1.classes) {
        fulfilled.push(course.subject + course.classId);
      }
    }

    if (year.summer2.status !== "INACTIVE") {
      for (const course of year.summer2.classes) {
        fulfilled.push(course.subject + course.classId);
      }
    }
  }

  return fulfilled;
}

/**
 * Given a schedule and a year, return the position (1-indexed) of the given year in the schedule (1, 2, 3, 4, etc)
 * Returns -1 if year is not found in the schedule
 * @param schedule the given schedule to locate the year
 * @param year the given year
 */
export function getPositionOfYearInSchedule(
  schedule: DNDSchedule,
  year: number
): number {
  const index = schedule.years.findIndex(y => y === year);

  if (index === -1) {
    return index;
  }
  return index + 1;
}

export function isYearInPast(yearIndex: number, academicYear: number): boolean {
  return academicYear > yearIndex + 1;
}

/**
 * Filters through the given list of course warnings to find all warnings for the given course
 * @param courseWarnings the list of course warnings to search through
 * @param course the search course
 */
export function findCourseWarnings(
  courseWarnings: CourseWarning[],
  course: DNDScheduleCourse
) {
  const result: CourseWarning[] = courseWarnings.filter(
    (w: CourseWarning) =>
      w.subject + w.classId === course.subject + course.classId
  );

  if (result.length === 0) {
    return undefined;
  } else {
    return result;
  }
}

/*
 *  Determines if this course is in the given term
 * @param courseToAdd the course that is being checked
 * @param term the term being checked
 * @returns whether or not this course is in the term
 */
function isCourseInTerm(courseToAdd: ScheduleCourse, term: DNDScheduleTerm) {
  return term.classes.some(
    course =>
      String(courseToAdd.classId) === String(course.classId) &&
      courseToAdd.subject === course.subject
  );
}

/**
 *  Determines if this course is in the given schedule
 * @param courseToAdd the course that is being checked
 * @param schedule the schedule being checked
 * @returns whether or not this course is in the schedule
 */
export function isCourseInSchedule(
  courseToAdd: ScheduleCourse,
  schedule: DNDSchedule
) {
  return schedule.years.some(
    year =>
      isCourseInTerm(courseToAdd, schedule.yearMap[year].spring) ||
      isCourseInTerm(courseToAdd, schedule.yearMap[year].fall) ||
      isCourseInTerm(courseToAdd, schedule.yearMap[year].summer1) ||
      isCourseInTerm(courseToAdd, schedule.yearMap[year].summer2)
  );
}
