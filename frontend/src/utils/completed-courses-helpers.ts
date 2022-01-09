import {
  DNDScheduleCourse,
  DNDSchedule,
  ISimplifiedCourseData,
  ISimplifiedCourseDataAPI,
} from "../models/types";
import {
  ScheduleCourse,
  ScheduleTerm,
  ScheduleYear,
  SeasonWord,
} from "../../../common/types";
import { convertToDNDSchedule } from "./schedule-helpers";
import { deepCopy } from "./deepCopy";
import { alterScheduleToHaveCorrectYears } from ".";

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
 * @param years the array of years
 * @param yearMap mapping of years to the corresponding year schedule
 * @return ScheduleYear
 */
export function numToTerm(
  index: number,
  years: number[],
  yearMap: { [key: number]: ScheduleYear }
): ScheduleTerm {
  let year = yearMap[years[Math.floor(index / 4)]];
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
export function getNextTerm(is_summer: boolean, classes: ScheduleCourse[]) {
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
  Parses a student's completed courses into a schedule with courses randomly populated into the schedule.
 */
export function parseCompletedCourses(
  completedCourses: ScheduleCourse[]
): { schedule: DNDSchedule; counter: number } {
  const years: number[] = [];
  const yearMap: { [key: number]: ScheduleYear } = {};

  // sorts courses to add by course ID so that it's sorta sorted by when they've likely taken the class
  const coursesToAdd = completedCourses.sort(
    (course1: ScheduleCourse, course2: ScheduleCourse) =>
      course1.classId.toString().localeCompare(course2.classId.toString())
  );

  let classTerm = 0;
  let populatingYear = 999;

  // if there are no more years to populate, add a new year
  const addYearCheck = () => {
    if (classTerm % 4 === 0) {
      addBlankScheduleYear(years, yearMap, populatingYear);
      populatingYear++;
    }
  };
  // while there are still completed classes left to take
  while (coursesToAdd.length != 0) {
    addYearCheck();
    let curTerm = numToTerm(classTerm, years, yearMap);
    // while the current term is not a class term, continue searching for the next class term.
    while (classTerm + 1 <= years.length * 4 && curTerm.status != "CLASSES") {
      classTerm += 1;
      addYearCheck();
      curTerm = numToTerm(classTerm, years, yearMap);
    }
    let newCourses = getNextTerm(
      classTerm % 4 == 2 || classTerm % 4 == 3,
      coursesToAdd
    );
    curTerm.classes = newCourses;
    classTerm += 1;
  }
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
