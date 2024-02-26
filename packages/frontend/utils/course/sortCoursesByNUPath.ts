import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";
import { countFilteredPaths } from "./countFilteredPaths";

/**
 * Sorts a list of courses by the number of NUPaths they have
 *
 * @param courses List of classes
 */
export const sortCoursesByNUPath = (
  courses: ScheduleCourse2<null>[],
  filteredNuPaths: NUPathEnum[]
): ScheduleCourse2<null>[] => {
  return courses.sort((course1, course2) => {
    return (
      countFilteredPaths(course2, filteredNuPaths) -
      countFilteredPaths(course1, filteredNuPaths)
    );
  });
};
