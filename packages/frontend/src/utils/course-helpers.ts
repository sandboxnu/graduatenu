import { fetchCourse } from "../api";
import { ISimplifiedCourseDataAPI } from "../models/types";
import {
  INEUPrereq,
  INEUPrereqCourse,
  IRequiredCourse,
  Requirement,
  ScheduleCourse,
} from "@graduate/common";

export async function getScheduleCoursesFromSimplifiedCourseDataAPI(
  courses: ISimplifiedCourseDataAPI[]
): Promise<ScheduleCourse[]> {
  let convertedCourses: ScheduleCourse[] = [];
  await Promise.all(
    courses.map(async (c) => {
      const course = await fetchCourse(c.subject, c.course_id.toString());
      if (course != null) {
        convertedCourses.push({ ...course, semester: c.semester || null });
      }
    })
  );
  return convertedCourses;
}

function isINEUPrereqCourse(val: INEUPrereq): val is INEUPrereqCourse {
  return !!(val as INEUPrereqCourse);
}

export async function getScheduleCourseCoreqs(
  course: ScheduleCourse
): Promise<ScheduleCourse[]> {
  let coursesCoreqs: ScheduleCourse[] = [];

  const coreq = course.coreqs;
  if (coreq?.type === "and") {
    const coreqCourses = coreq.values;
    await Promise.all(
      coreqCourses.map(async (coreqCourse: INEUPrereq) => {
        if (isINEUPrereqCourse(coreqCourse)) {
          const course = await fetchCourse(
            coreqCourse.subject,
            coreqCourse.classId
          );
          if (course != null) {
            coursesCoreqs.push(course);
          }
        }
      })
    );
  }
  return coursesCoreqs;
}

/**
 * Flattens the Requirement[] into only a list of Requirements/Requirement sets
 * This means that all inner lists will only contain one class or a list of the primary class and its labs/recitations
 * @param reqs
 */
export function flatten(reqs: Requirement[]): IRequiredCourse[][] {
  return reqs.map(flattenOne).reduce((array, cur) => array.concat(cur), []);
}

function flattenOne(req: Requirement): IRequiredCourse[][] {
  if (req.type === "COURSE") {
    return [[req as IRequiredCourse]];
  } else if (
    req.type === "AND" &&
    req.courses.filter((c) => c.type === "COURSE").length
  ) {
    return [req.courses as IRequiredCourse[]];
  } else if (req.type === "AND" || req.type === "OR") {
    return flatten(req.courses);
  } else {
    return [];
  }
}

export const courseToString = (c: {
  subject: string;
  classId: number | string;
}) => `${c.subject.toUpperCase()}${c.classId}`;

type CourseIdentifier = { classId: number | string; subject: string };
export const courseEq = (c1: CourseIdentifier, c2: CourseIdentifier) =>
  String(c1.classId) === String(c2.classId) && c1.subject === c2.subject;

export const coursesToString = (c: IRequiredCourse[]) =>
  c.map(courseToString).join(",");
