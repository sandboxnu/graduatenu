/** Only the details we need to compare courses. */
type CourseEqualsDetails = {
  classId: string;
  subject: string;
} & {
  [key: string]: any;
};

export const isEqualCourses = (
  course1: CourseEqualsDetails,
  course2: CourseEqualsDetails
) => {
  return (
    course1.classId === course2.classId && course1.subject === course2.subject
  );
};
