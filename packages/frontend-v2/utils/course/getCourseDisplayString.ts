import { ScheduleCourse2 } from "@graduate/common";

/**
 * Provides a unique string consisting of the course subject code and class id
 * for each course.
 */
export const getCourseDisplayString = (course: ScheduleCourse2<unknown>) => {
  return `${course.subject}${course.classId}`;
};
