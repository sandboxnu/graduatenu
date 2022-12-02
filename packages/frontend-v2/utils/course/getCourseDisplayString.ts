/** Only the details we need to display a course. */
type CourseDisplayDetails = {
  classId: string;
  subject: string;
} & {
  [key: string]: any;
};

/**
 * Provides a unique string consisting of the course subject code and class id
 * for each course.
 */
export const getCourseDisplayString = (course: CourseDisplayDetails) => {
  return `${course.subject}${course.classId}`;
};
