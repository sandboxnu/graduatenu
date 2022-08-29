import { Schedule2, ScheduleCourse2 } from "@graduate/common";
import { isEqualCourses } from "../course";
import { flattenScheduleToTerms } from "./updatePlanOnDragEnd";

/** Checks if a course is already present in the schedule. */
export const isCourseInSchedule = (
  course: ScheduleCourse2<unknown>,
  schedule: Schedule2<unknown>
) => {
  const courses = flattenScheduleToCourses(schedule);
  const res = courses.some((courseInSched) =>
    isEqualCourses(courseInSched, course)
  );
  return res;
};

const flattenScheduleToCourses = (schedule: Schedule2<unknown>) => {
  const terms = flattenScheduleToTerms(schedule);
  const courses: ScheduleCourse2<unknown>[] = [];
  terms.forEach((term) => courses.push(...term.classes));
  return courses;
};
