import { SearchAPI } from "@graduate/api-client";
import { ScheduleCourse2, INEUReq, INEUReqCourse } from "@graduate/common";

/** Get all the required(ANDs only) coreqs for a given course. */
export async function getRequiredCourseCoreqs(
  course: ScheduleCourse2<unknown>,
  catalogYear: number
): Promise<ScheduleCourse2<null>[]> {
  const coursesCoreqs: ScheduleCourse2<null>[] = [];

  const coreq = course.coreqs;
  if (coreq?.type === "and") {
    const coreqCourses = coreq.values;

    // fetch the course details for all required coreqs from SearchNEUs API
    await Promise.all(
      coreqCourses.map(async (coreqCourse: INEUReq) => {
        if (isINEUPrereqCourse(coreqCourse)) {
          const course = await SearchAPI.fetchCourse(
            coreqCourse.subject,
            coreqCourse.classId,
            catalogYear
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
const isINEUPrereqCourse = (val: INEUReq): val is INEUReqCourse => {
  return !!(val as INEUReqCourse);
};
