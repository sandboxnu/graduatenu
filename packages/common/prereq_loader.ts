import {
  Schedule,
  INEUAndPrereq,
  INEUOrPrereq,
  ScheduleYear,
  ScheduleTerm,
  ScheduleCourse,
} from "./types";
import DataLoader from "dataloader";
import Axios from "axios";

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
 * The result of a prereq query for a class. If this interface is changed, then the schema query needs
 * to also be changes (see the latestOccurrence, line ~194).
 */
interface NonEmptyQueryResult {
  maxCredits?: number;
  minCredits?: number;
  prereqs?: INEUOrPrereq | INEUAndPrereq;
  coreqs?: INEUOrPrereq | INEUAndPrereq;
  name: string;
}

// prereq query results can be undefined, if the target class doesn't exist.
type PrereqQueryResult = undefined | NonEmptyQueryResult;

/**
 * Asynchronously adds prereqs to a Schedule.
 * Does not do mutation.
 * @param schedule the schedule to add prereqs to
 * @param year the year to grab prereqs from (always uses fall).
 */
export async function addPrereqsToSchedule(
  schedule: Schedule
): Promise<Schedule> {
  // doubly curried loader.
  // here we give it the year.
  // next parameter given is the termId.
  // last parameter is the loader parameter.
  const loader: DataLoader<SimpleCourse, PrereqQueryResult> = new DataLoader<
    SimpleCourse,
    PrereqQueryResult
  >(queryCoursePrereqData);

  // return the results
  let results = await prereqifySchedule(schedule, loader);

  return results;
}

/**
 * Asynchronously adds prereqs to a Schedule.
 * Does not do mutation.
 * @param schedules the schedule to add prereqs to
 * @param year the year to grab prereqs from (always uses fall).
 */
export async function addPrereqsToSchedules(
  schedules: Schedule[]
): Promise<Schedule[]> {
  // doubly curried loader.
  // here we give it the year.
  // next parameter given is the termId.
  // last parameter is the loader parameter.
  const loader: DataLoader<SimpleCourse, PrereqQueryResult> = new DataLoader<
    SimpleCourse,
    PrereqQueryResult
  >(queryCoursePrereqData);

  // return the results
  let results = await Promise.all(
    schedules.map((sched: Schedule) => prereqifySchedule(sched, loader))
  );

  return results;
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
    years: schedule.years,
    yearMap: newYearMap,
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
    name: "",
  };

  let queryResult: PrereqQueryResult;
  try {
    // produces the class.
    queryResult = await loader.load({
      subject: course.subject,
      classId: Number(course.classId),
      termId: termId,
    });
  } catch (err) {
    // if we get an error, better to throw and see what went wrong, vs silently failing.
    throw err;
  }

  // optionally add prereqs, coreqs to object.
  if (queryResult) {
    prereqified.coreqs = queryResult.coreqs ? queryResult.coreqs : undefined;
    prereqified.prereqs = queryResult.prereqs ? queryResult.prereqs : undefined;
    prereqified.numCreditsMax = queryResult.maxCredits
      ? queryResult.maxCredits
      : 0;
    prereqified.numCreditsMin = queryResult.minCredits
      ? queryResult.minCredits
      : 0;
    prereqified.name = queryResult.name;
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
  // automatically use the latest occurrence.
  const courseSchema: string[] = courses.map((course: SimpleCourse) => {
    return `class(classId: "${course.classId}", subject: "${course.subject}") {
      latestOccurrence {
        prereqs
        coreqs
        name
        minCredits
        maxCredits
      }
    }`;
  });

  // build the query schema
  const querySchema: string = `
  query {
    ${courseSchema.reduce(
      (accumulator: string, currentValue: string, index: number) => {
        return accumulator + `course${String(index)}: ${currentValue}\n`;
      },
      ""
    )}
  }
  `;

  // make the request.
  const queryResult = await Axios.post("https://api.searchneu.com/graphql", {
    query: querySchema,
  });

  // result comes back as json, so we need to parse it.
  // it is an object, with a data field.

  // the data.
  const data = queryResult.data;

  const result: PrereqQueryResult[] = [];
  for (let i = 0; i < courses.length; i += 1) {
    // each course${i} property is either null, or an object containing a
    // "latestOccurrence" property object.
    // the occurrence is then guaranteed to have the properties we requested:
    // - prereqs
    // - corereqs
    // - name

    // however, searchNEU stores the classId as a string rather than a number

    // if the result was found (aka results were not null), then push
    const current = data[`course${i}`];
    if (current) {
      result.push(current.latestOccurrence);
    } else {
      result.push(undefined);
    }
  }

  // todo: flesh out the provided request.
  return result;
}
