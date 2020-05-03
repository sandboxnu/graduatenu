import { DNDScheduleCourse, DNDSchedule } from "../models/types";

/**
 * Returns the sum of all credits in the courses
 * @param courses
 */
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
