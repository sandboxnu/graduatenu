import { fetchCourse } from "../api";
import {
  ISimplifiedCourseData,
  ISimplifiedCourseDataAPI,
} from "../models/types";
import { ScheduleCourse } from "../../../common/types";

export async function getScheduleCoursesFromSimplifiedCourseDataAPI(
  courses: ISimplifiedCourseDataAPI[]
): Promise<ScheduleCourse[]> {
  console.log(courses);
  let converetedCourses: ScheduleCourse[] = [];
  await Promise.all(
    courses.map(async c => {
      console.log(c);
      const course = await fetchCourse(c.subject, c.course_id.toString());
      if (course != null) {
        converetedCourses.push(course);
      }
    })
  );
  return converetedCourses;
}
