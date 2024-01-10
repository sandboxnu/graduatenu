import { ScheduleTerm2 } from "@graduate/common";
import { isEqualCourses } from "../course";

/** Checks if a course is already present in the given semester. */
export const isCourseInTerm = (
  courseClassId: string,
  courseSubject: string,
  term: ScheduleTerm2<unknown>
) => {
  return term.classes.some((c) =>
    isEqualCourses(c, { classId: courseClassId, subject: courseSubject })
  );
};
