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
  completedCourses: ScheduleCourse[]
): [DNDSchedule, number] {
  const currentCalendarYear = new Date().getFullYear();
  const currentYear =
    new Date().getMonth() <= 3 ? currentCalendarYear : currentCalendarYear + 1;
  const numYearsInSchool = graduationYear - currentYear + academicYear;
  const startingYear = graduationYear - numYearsInSchool;

  const yearsList = [];
  // should add consecutive years from startingYear to one less than graduationYear
  for (var y = startingYear; y < graduationYear; y++) {
    yearsList.push(y);
  }

  let yearMap: { [key: number]: DNDScheduleYear } = {};
  let counter = 1;

  const [dndCourses, courseCounter] = convertToDNDCourses(completedCourses, 0);

  for (const y of yearsList) {
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

  return [schedule, courseCounter];
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
      continue;
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

export const clearSchedule = (schedule: DNDSchedule) => {
  const yearMapCopy = JSON.parse(JSON.stringify(schedule.yearMap));
  for (const y of schedule.years) {
    const year = JSON.parse(JSON.stringify(schedule.yearMap[y]));
    year.fall.classes = [];
    year.spring.classes = [];
    year.summer1.classes = [];
    year.summer2.classes = [];
    yearMapCopy[y] = year;
  }
  schedule.yearMap = yearMapCopy;
  return schedule;
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
