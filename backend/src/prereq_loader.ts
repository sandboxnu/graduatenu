import {
  Schedule,
  INEUAndPrereq,
  INEUOrPrereq,
  ScheduleYear,
  ScheduleTerm,
  ScheduleCourse,
  INEUCourse,
} from "./types";
import DataLoader from "dataloader";
import request from "request-promise";

/**
 * Courses should have at least a classId and a subject, in order to query them.
 * May have a termId.
 */
interface SimpleCourse {
  termId?: number;
  subject: string;
  classId: number;
}

/**
 * The result of a prereq query for a class.
 */
interface PrereqQueryResult {
  prereqs?: INEUOrPrereq | INEUAndPrereq;
  coreqs?: INEUOrPrereq | INEUAndPrereq;
  maxCredits: number;
  minCredits: number;
}

/**
 * Asynchronously adds prereqs to a Schedule.
 * Does not do mutation.
 * @param schedules the schedule to add prereqs to
 */
export async function addPrereqsToSchedules(
  schedules: Schedule[]
): Promise<Schedule[]> {
  // the loader to use for building a
  const loader = new DataLoader<SimpleCourse, PrereqQueryResult>(
    (keys: SimpleCourse[]) => queryCoursePrereqData(keys)
  );

  // return the results
  return Promise.all(
    schedules.map((sched: Schedule) => prereqifySchedule(sched, loader))
  );
}

/**
 * Loads prereqs for a given schedule
 * @param schedule the schedule
 * @param loader the loader
 */
async function prereqifySchedule(
  schedule: Schedule,
  loader: DataLoader<SimpleCourse, PrereqQueryResult>
): Promise<Schedule> {
  // does not do mutation!
  const newYearMap: { [key: number]: ScheduleYear } = {};

  // convert each of the years
  for (const year of schedule.years) {
    newYearMap[year] = await prereqifyScheduleYear(
      schedule.yearMap[year],
      loader
    );
  }

  // reconstructs a year
  return {
    years: schedule.years.slice(0),
    yearMap: newYearMap,
    id: schedule.id,
  };
}

/**
 * Asynchronously adds prereqs to a provided ScheduleYear
 * @param yearObj the year object to add prereqs to
 * @param loader the loader
 */
async function prereqifyScheduleYear(
  yearObj: ScheduleYear,
  loader: DataLoader<SimpleCourse, PrereqQueryResult>
): Promise<ScheduleYear> {
  return {
    year: yearObj.year,
    fall: await prereqifyScheduleTerm(yearObj.fall, loader),
    spring: await prereqifyScheduleTerm(yearObj.spring, loader),
    summer1: await prereqifyScheduleTerm(yearObj.summer1, loader),
    summer2: await prereqifyScheduleTerm(yearObj.summer2, loader),
    isSummerFull: yearObj.isSummerFull,
  };
}

/**
 * Asynchronously adds prereqs to a term's courses.
 * @param termObj the term object to add prereqs to
 * @param loader the loader
 */
async function prereqifyScheduleTerm(
  termObj: ScheduleTerm,
  loader: DataLoader<SimpleCourse, PrereqQueryResult>
): Promise<ScheduleTerm> {
  // the new classes.
  const newClasses: Promise<ScheduleCourse[]> = Promise.all(
    termObj.classes.map((course: ScheduleCourse) =>
      prereqifyScheduleCourse(course, termObj.termId, loader)
    )
  );

  return {
    season: termObj.season,
    year: termObj.year,
    termId: termObj.termId,
    id: termObj.id,
    classes: await newClasses,
    status: termObj.status,
  };
}

/**
 * Asynchronously adds prereqs to a provided course.
 * @param course the course to add prereqs to
 * @param loader the loader
 */
async function prereqifyScheduleCourse(
  course: ScheduleCourse,
  termId: number,
  loader: DataLoader<SimpleCourse, PrereqQueryResult>
): Promise<ScheduleCourse> {
  // the base prereqified object
  const prereqified: ScheduleCourse = {
    classId: course.classId,
    subject: course.subject,
    numCreditsMin: course.numCreditsMin,
    numCreditsMax: course.numCreditsMax,
  };

  let queryResult: PrereqQueryResult;
  try {
    // produces the class.
    queryResult = await loader.load({
      subject: course.subject,
      classId: course.classId,
      termId: termId,
    });
  } catch (err) {
    // if we error, then return the previous course.
    return course;
  }

  // optionally add prereqs, coreqs to object.
  if (queryResult) {
    queryResult.coreqs ? (prereqified.coreqs = queryResult.coreqs) : undefined;
    queryResult.prereqs
      ? (prereqified.prereqs = queryResult.prereqs)
      : undefined;
    // prereqified.numCreditsMax = queryResult.maxCredits;
    // prereqified.numCreditsMin = queryResult.minCredits;
    return prereqified;
  } else {
    return course;
  }
}

/**
 * Queries SearchNEU using GraphQL to look up the prereqs for each of the provided courses.
 * @param courses the courses to lookup prereqs for
 */
async function queryCoursePrereqData(
  courses: SimpleCourse[]
): Promise<PrereqQueryResult[]> {
  // for each one of the courses, map to a string.
  const courseSchema: string[] = courses.map((course: SimpleCourse) => {
    return `
    class(classId: ${course.classId}, subject: \"${course.subject}\") { 
      occurrence(termId: ${course.termId}) { 
        prereqs 
        coreqs 
      }
    }
    `;
  });

  // build the query schema
  const querySchema: string = `
  query {
    ${courseSchema.reduce(
      (accumulator: string, currentValue: string, index: number) => {
        accumulator += `\"${String(index)}\": ${currentValue}\n`;
        return accumulator;
      },
      ""
    )}
  }
  `;

  // make the request.
  const queryResult = await request("https://searchneu.com/graphql", {
    body: querySchema,
  });

  const result: PrereqQueryResult[] = [];
  for (let i = 0; i < courses.length; i += 1) {
    result.push(queryResult[i]);
  }

  // todo: flesh out the provided request.
  return result;
}
