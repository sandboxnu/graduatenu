import {
  DNDSchedule,
  DNDScheduleYear,
  DNDScheduleCourse,
  DNDScheduleTerm,
  SeasonEnum,
  StatusEnum,
  CourseWarning,
} from "../models/types";
import { Schedule, ScheduleCourse, SeasonWord } from "../../../common/types";

export function generateInitialSchedule(
  academicYear: number,
  graduationYear: number,
  completedCourses: ScheduleCourse[],
  major: string,
  coopCycle: string,
  allPlans: Record<string, Schedule[]>
): [DNDSchedule, number] {
  const currentPlan = allPlans[major].find(
    (p: Schedule) => planToString(p) === coopCycle
  )!;

  const [dndCourses, counter] = convertToDNDCourses(completedCourses, 0);
  let [schedule, courseCounter] = convertToDNDSchedule(currentPlan!, counter);
  schedule = clearSchedule(schedule, academicYear, graduationYear); // clear all courses from example plan

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

export function generateInitialScheduleNoCoopCycle(
  academicYear: number,
  graduationYear: number,
  completedCourses: ScheduleCourse[]
): [DNDSchedule, number] {
  let yearMap: { [key: number]: DNDScheduleYear } = {};
  let counter = 1;
  const numYears = 4; // default is 4 years

  const [dndCourses, courseCounter] = convertToDNDCourses(completedCourses, 0);

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
        id: counter,
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
      spring: {
        season: SeasonEnum.SP,
        year: y,
        termId: Number(String(y) + String(30)),
        id: counter + 1,
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
      summer1: {
        season: SeasonEnum.S1,
        year: y,
        termId: Number(String(y) + String(40)),
        id: counter + 2,
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
      summer2: {
        season: SeasonEnum.S2,
        year: y,
        termId: Number(String(y) + String(60)),
        id: counter + 3,
        status: StatusEnum.CLASSES,
        classes: dndCourses.splice(0, 4), // the first 4 courses in the list, and remove them from the list
      },
    };
    counter += 4;
  }

  const schedule = {
    years: yearsList,
    yearMap: yearMap,
  };

  return [
    alterScheduleToHaveCorrectYears(schedule, academicYear, graduationYear),
    courseCounter,
  ];
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

export function alterScheduleToHaveCorrectYears(
  schedule: DNDSchedule,
  academicYear: number,
  graduationYear: number
): DNDSchedule {
  const currentCalendarYear = new Date().getFullYear();
  const currentYear =
    new Date().getMonth() <= 3 ? currentCalendarYear : currentCalendarYear + 1;
  const numYearsInSchool = graduationYear - currentYear + academicYear;
  const startingYear = graduationYear - numYearsInSchool;

  const newYearMap: { [key: number]: DNDScheduleYear } = {};
  const newYears: number[] = [];

  for (let i = 0; i < schedule.years.length; i++) {
    const newYear = startingYear + i;
    newYears.push(newYear);

    const oldYear = schedule.years[i];
    newYearMap[newYear] = schedule.yearMap[oldYear];
    newYearMap[newYear].fall.termId = Number(String(newYear) + String(10));
    newYearMap[newYear].spring.termId = Number(String(newYear) + String(30));
    newYearMap[newYear].summer1.termId = Number(String(newYear) + String(40));
    newYearMap[newYear].summer2.termId = Number(String(newYear) + String(60));
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
  const newSchedule = JSON.parse(JSON.stringify(schedule)) as DNDSchedule;
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

export const clearSchedule = (
  schedule: DNDSchedule,
  academicYear: number,
  graduationYear: number
) => {
  const yearMapCopy = JSON.parse(JSON.stringify(schedule.yearMap));
  for (const y of schedule.years) {
    const year = JSON.parse(JSON.stringify(schedule.yearMap[y]));
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
  return alterScheduleToHaveCorrectYears(
    newSchedule,
    academicYear,
    graduationYear
  );
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
