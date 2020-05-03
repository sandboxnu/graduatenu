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
