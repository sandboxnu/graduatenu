import { ScheduleCourse2 } from "@graduate/common";

export const isEqualCourses = (
  course1: ScheduleCourse2<unknown>,
  course2: ScheduleCourse2<unknown>
) => {
  return (
    course1.classId === course2.classId && course1.subject === course2.subject
  );
};
