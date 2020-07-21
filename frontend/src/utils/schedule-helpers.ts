import {
  DNDSchedule,
  DNDScheduleYear,
  DNDScheduleCourse,
  DNDScheduleTerm,
} from "../models/types";
import { Schedule, ScheduleCourse, SeasonWord } from "graduate-common";

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

export function convertTermIdToYear(termId: number): number {
  return Math.trunc(termId / 100);
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

    for (const course of year.fall.classes) {
      fulfilled.push(course.subject + course.classId);
    }

    for (const course of year.spring.classes) {
      fulfilled.push(course.subject + course.classId);
    }

    for (const course of year.summer1.classes) {
      fulfilled.push(course.subject + course.classId);
    }

    for (const course of year.summer2.classes) {
      fulfilled.push(course.subject + course.classId);
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
