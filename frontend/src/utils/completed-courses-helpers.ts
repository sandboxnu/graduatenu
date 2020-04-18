import { ICompletedCoursesMap } from "../models/types";

export function sumCreditsFromList(courses: ICompletedCoursesMap): number {
  if (!courses) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < 4; i++) {
    for (const course of courses[i]) {
      sum += course.numCreditsMax;
    }
  }
  return sum;
}

export function getStandingFromCompletedCourses(
  courses: ICompletedCoursesMap
): string {
  const credits = sumCreditsFromList(courses);

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

export function getNumberOfCompletedCourses(
  courses: ICompletedCoursesMap
): number {
  if (!courses) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < 4; i++) {
    sum += courses[i].length;
  }
  return sum;
}

export function getIndexFromCompletedCoursesDNDID(dndId: string): number {
  return Number(dndId[dndId.length - 1]);
}
