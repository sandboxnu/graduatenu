import { API, SearchAPI } from "@graduate/api-client";
import {
  ScheduleCourse2,
  INEUPrereq,
  INEUPrereqCourse,
} from "@graduate/common";

/** Get all the required(ANDs only) coreqs for a given course. */
export async function getRequiredCourseCoreqs(
  course: ScheduleCourse2<unknown>
): Promise<ScheduleCourse2<null>[]> {
  const coursesCoreqs: ScheduleCourse2<null>[] = [];

  const coreq = course.coreqs;
  if (coreq?.type === "and") {
    const coreqCourses = coreq.values;

    // fetch the course details for all required coreqs from SearchNEUs API
    await Promise.all(
      coreqCourses.map(async (coreqCourse: INEUPrereq) => {
        if (isINEUPrereqCourse(coreqCourse)) {
          const course = await SearchAPI.fetchCourse(
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

/** Type Guard: Asserts that the given val is a SearchNEU pre-req course. */
const isINEUPrereqCourse = (val: INEUPrereq): val is INEUPrereqCourse => {
  return !!(val as INEUPrereqCourse);
};
