import { DNDSchedule } from "../models/types";
import { ScheduleCourse, ScheduleTerm, ScheduleYear } from "@graduate/common";
import {
  calculateScheduleStartYear,
  convertToDNDSchedule,
} from "./schedule-helpers";

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
 * @param years the array of years
 * @param yearMap mapping of years to the corresponding year schedule
 * @return ScheduleYear
 */
export function numToTerm(
  index: number,
  years: number[],
  yearMap: { [key: number]: ScheduleYear }
): ScheduleTerm {
  const year = yearMap[years[Math.floor(index / 4)]];
  if (index % 4 === 0) {
    return year.fall;
  } else if (index % 4 === 1) {
    return year.spring;
  } else if (index % 4 === 2) {
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
export function getNextTerm(is_summer: boolean, classes: ScheduleCourse[]) {
  const maxCredits = is_summer ? 9 : 18;
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

/**
 * Parses a student's completed courses into a schedule with courses just all shoved into the first fall semester.
 * @param completedCourses the completed courses
 * @param academicYear the academic year of the student (eg 3 for current 3rd year)
 */
export function parseCompletedCourses(
  completedCourses: ScheduleCourse[],
  academicYear: number
): { schedule: DNDSchedule; counter: number } {
  const years: number[] = [];
  const yearMap: { [key: number]: ScheduleYear } = {};
  addBlankScheduleYear(
    years,
    yearMap,
    calculateScheduleStartYear(academicYear)
  );
  yearMap[years[0]].fall.classes = [...completedCourses];
  const [schedule, counter] = convertToDNDSchedule({ years, yearMap }, 0);
  return { schedule, counter };
}

/*
  Adds a blank schedule year with all terms being class terms.
 */
function addBlankScheduleYear(
  years: number[],
  yearMap: { [key: number]: ScheduleYear },
  currentYear: number
) {
  years.push(currentYear);
  yearMap[currentYear] = {
    year: currentYear,
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
      status: "CLASSES",
      classes: [],
    },
    summer2: {
      season: "S2",
      year: currentYear,
      termId: Number(String(currentYear) + "60"),
      status: "CLASSES",
      classes: [],
    },
    isSummerFull: false,
  };
}
