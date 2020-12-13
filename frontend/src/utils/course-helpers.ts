import { fetchCourse } from "../api";
import {
  ISimplifiedCourseData,
  ISimplifiedCourseDataAPI,
} from "../models/types";
import { ScheduleCourse, INEUPrereq, INEUPrereqCourse } from "../../../common/types";

export async function getScheduleCoursesFromSimplifiedCourseDataAPI(
  courses: ISimplifiedCourseDataAPI[]
): Promise<ScheduleCourse[]> {
  let converetedCourses: ScheduleCourse[] = [];
  await Promise.all(
    courses.map(async c => {
      const course = await fetchCourse(c.subject, c.course_id.toString());
      if (course != null) {
        converetedCourses.push(course);
      }
    })
  );
  return converetedCourses;
}

function isINEUPrereqCourse(val: INEUPrereq): val is INEUPrereqCourse {
  if (val as INEUPrereqCourse) {
    return true;
  }
  return false;
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
          const course = await fetchCourse(coreqCourse.subject, coreqCourse.classId);
          if (course != null) {
            coursesCoreqs.push(course);
          }
        }
    }));
  }
  return coursesCoreqs;
}
