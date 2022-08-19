import { Schedule2, ScheduleCourse2, ScheduleTerm2 } from "@graduate/common";

/** Find a course from all the terms within a schedule given its id. */
export const findCourseByDndId = <T>(
  schedule: Schedule2<T>,
  courseId: T
): ScheduleCourse2<T> | undefined => {
  for (const year of schedule.years) {
    const fallRes = findCourseByIdInTerm<T>(year.fall, courseId);
    if (fallRes) {
      return fallRes;
    }

    const springRes = findCourseByIdInTerm<T>(year.spring, courseId);
    if (springRes) {
      return springRes;
    }

    const summer1Res = findCourseByIdInTerm<T>(year.summer1, courseId);
    if (summer1Res) {
      return summer1Res;
    }

    const summer2Res = findCourseByIdInTerm<T>(year.summer2, courseId);
    if (summer2Res) {
      return summer2Res;
    }
  }

  return undefined;
};

const findCourseByIdInTerm = <T>(
  scheduleTerm: ScheduleTerm2<T>,
  courseId: T
): ScheduleCourse2<T> | undefined => {
  return scheduleTerm.classes.find((course) => course.id === courseId);
};
