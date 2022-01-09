import {
  DNDScheduleCourse,
  DNDSchedule,
  ISimplifiedCourseData,
  ISimplifiedCourseDataAPI,
} from "../models/types";
import {
  ScheduleCourse,
  ScheduleYear,
  SeasonWord,
} from "../../../common/types";
import { convertToDNDSchedule } from "./schedule-helpers";

/**
 * Returns the sum of all credits in the courses
 * @param courses
 */
export function sumCreditsFromList(courses: ScheduleCourse[]): number {
  if (!courses) {
    return 0;
  }

  let sum = 0;
  for (const course of courses) {
    sum += course.numCreditsMax;
  }
  return sum;
}

/**
 * Returns the student's standing based on the number of credits completed
 * @param credits completed credits
 */
export function getStandingFromCompletedCourses(credits: number): string {
  if (credits < 32) {
    return "Freshman";
  }
  if (credits < 64) {
    return "Sophomore";
  }
  if (credits < 96) {
    return "Junior";
  }
  return "Senior";
}

/**
 * Returns the term that lines up with the given index as if to go in the order that the terms
 * occur in, where the 0th index is the first fall term in the schedule.
 * @param index the term index
 * @param schedule the schedule where the tern is being retrieved from
 */
export function numToTerm(index: number, schedule: DNDSchedule) {
  let year = schedule.yearMap[schedule.years[Math.floor(index / 4)]];
  if (index % 4 == 0) {
    return year.fall;
  } else if (index % 4 == 1) {
    return year.spring;
  } else if (index % 4 == 2) {
    return year.summer1;
  } else {
    return year.summer2;
  }
}

/**
 * Retrieves classes from the front of the array that best fills the specific term, based on whether or not
 * it is a summer term. Mutates the array such that the classes being returned are no longer in the original list
 * @param is_summer is whether or not the term that classes are being retrieved for is summer or not
 * @param classes the classes that will populate the schedule
 */
export function getNextTerm(is_summer: boolean, classes: DNDScheduleCourse[]) {
  let maxCredits = is_summer ? 9 : 18;
  let counter = 0;
  let credits = 0;
  while (classes.length > counter) {
    if (classes[counter].numCreditsMax + credits <= maxCredits) {
      credits += classes[counter].numCreditsMax;
      counter = counter + 1;
    } else {
      break;
    }
  }
  return classes.splice(0, counter);
}

export function getSimplifiedCourseData(
  courses: ISimplifiedCourseData[],
  completion: string,
  semester: string = ""
): ISimplifiedCourseDataAPI[] {
  return courses.map(course => {
    return {
      subject: course.subject,
      course_id: course.classId.toString(),
      semester: semester,
      completion: completion,
    };
  });
}
/*
Parses a student's completed courses into a schedule with courses placed in
whichever semester they were taken. Ignores COOP3945.
 */
export function parseCompletedCourses(completedCourses: ScheduleCourse[]) {
  const years: number[] = [];
  const yearMap: { [key: number]: ScheduleYear } = {};

  const sortedCourses = completedCourses.sort(
    (course1: ScheduleCourse, course2: ScheduleCourse) =>
      course1.classId.toString().localeCompare(course2.classId.toString())
  );

  const creditsTaken = sumCreditsFromList(sortedCourses);
  let curSchedule = draft.present.schedule;
  let classTerm = 0;
  // while there are still completed classes left to take and we have not passed the number of terms
  // in the schedule
  while (dndCourses.length != 0 || classTerm >= curSchedule.years.length * 4) {
    let curTerm = numToTerm(classTerm, curSchedule);
    // while the current term is not a class term, continue searching for the next class term.
    while (
      classTerm + 1 <= curSchedule.years.length * 4 &&
      curTerm.status != "CLASSES"
    ) {
      classTerm += 1;
      curTerm = numToTerm(classTerm, curSchedule);
    }
    let newCourses = getNextTerm(
      classTerm % 4 == 2 || classTerm % 4 == 3,
      dndCourses
    );
    curTerm.classes = newCourses;
    classTerm += 1;
  }

  return convertToDNDSchedule({ years, yearMap }, 0);
}
