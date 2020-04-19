import { DNDScheduleCourse, DNDSchedule } from "../models/types";

export function sumCreditsFromList(courses: DNDScheduleCourse[]): number {
  if (!courses) {
    return 0;
  }

  let sum = 0;
  for (const course of courses) {
    sum += course.numCreditsMax;
  }
  return sum;
}

export function getStandingFromCompletedCourses(credits: number): string {
  //const credits = sumCreditsFromList(courses);

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

export function divideIntoTerms(courses: DNDScheduleCourse[]) {
  let creditCount = 0;
  let allTerms: DNDScheduleCourse[][] = [];
  let currentTerm: DNDScheduleCourse[] = [];
  for (let course of courses) {
    if (creditCount + course.numCreditsMax > 19) {
      allTerms.push(currentTerm);
      currentTerm = [];
      creditCount = 0;
    }
    currentTerm.push(course);
    creditCount += course.numCreditsMax;
  }
  allTerms.push(currentTerm);
  return allTerms;
}
