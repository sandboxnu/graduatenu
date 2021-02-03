import {
  DNDScheduleCourse,
  DNDSchedule,
  ISimplifiedCourseData,
  ISimplifiedCourseDataAPI,
} from "../models/types";
import { ScheduleCourse, ScheduleYear } from "../../../common/types";
import { convertToDNDSchedule } from "./schedule-helpers";

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

/**
 * def parse_completed_courses
 completed_courses = user_params[:courses]&.select {|a| a['completion'] == 'PASSED'} || []
 years = []
 year_map = {}
 term_map = {
        "10" => "fall",
        "30" => "spring",
        "40" => "summer1",
        "60" => "summer2"
    }
 completed_courses.each do |course|
 current_year = course.semester[0..3].to_i
 current_semester = course.semester[4..5]
 if !years.include? current_year
 years.push(current_year)
 year_map[current_year] = {
            year: current_year,
            fall: {
                season: "FL",
                year: current_year - 1,
                termId: current_year.to_s + "10",
                status: "CLASSES",
                classes: []
            },
            spring: {
                season: "SP",
                year: current_year,
                termId: current_year.to_s + "30",
                status: "CLASSES",
                classes: []
            },
            summer1: {
                season: "S1",
                year: current_year,
                termId: current_year.to_s + "40",
                status: "VACATION",
                classes: []
            },
            summer2: {
                season: "S2",
                year: current_year,
                termId: current_year.to_s + "60",
                status: "VACATION",
                classes: []
            },
            isSummerFull: false}
 end
 year_map[current_year][term_map[current_semester]][classes].push(course)
 if course.subject == "COOP"
 year_map[current_year][term_map[current_semester]][status] = "COOP"
 else
 year_map[current_year][term_map[current_semester]][status] = "CLASSES"
 end
 end
 return {years: years, yearMap: year_map}
 end
 */
export function parseCompletedCourses(
  completedCourses: ScheduleCourse[] //TODO: Make new type for schedulecourse
) {
  const years: number[] = [];
  const yearMap: { [key: number]: ScheduleYear } = {};
  const termMap: { [key: string]: string } = {
    "10": "fall",
    "30": "spring",
    "40": "summer1",
    "60": "summer2",
  };
  completedCourses
    .filter(course => course.semester !== null)
    .forEach(course => {
      const currentYear = Number(course.semester!.slice(0, 4));
      const currentSemester: string = course.semester!.slice(4, 6);
      if (!years.includes(currentYear)) {
        years.push(currentYear);
        yearMap[currentYear] = {
          year: currentYear,
          fall: {
            season: "FL",
            year: currentYear - 1,
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
            status: "INACTIVE",
            classes: [],
          },
          summer2: {
            season: "S2",
            year: currentYear,
            termId: Number(String(currentYear) + "60"),
            status: "INACTIVE",
            classes: [],
          },
          isSummerFull: false,
        };
      }
      //@ts-ignore
      yearMap[currentYear][termMap[currentSemester]][classes].push(course);
      if (course.subject == "COOP") {
        //@ts-ignore
        yearMap[currentYear][termMap[currentSemester]]["status"] = "COOP";
      } else {
        //@ts-ignore
        yearMap[currentYear][termMap[currentSemester]]["status"] = "CLASSES";
      }
    });
  return convertToDNDSchedule({ years, yearMap }, 0);
}
