import { ScheduleCourse2 } from "@graduate/common";
import { useState } from "react";
import { isEqualCourses } from "../utils";

/** This is a hook to hold a list of selected courses. */
export const useSelectedCourses = () => {
  const [selectedCourses, setSelectedCourses] = useState<
    ScheduleCourse2<null>[]
  >([]);

  // Add course if not already selected
  const addSelectedCourse = (course: ScheduleCourse2<null>) => {
    if (isCourseAlreadySelected(course)) {
      return;
    }

    setSelectedCourses((prev) => [...prev, course]);
  };

  // Remove course from selected list
  const removeSelectedCourse = (course: ScheduleCourse2<null>) => {
    setSelectedCourses((prev) =>
      prev.filter((selectedCourse) => !isEqualCourses(selectedCourse, course))
    );
  };

  // Check if course is already selected
  const isCourseAlreadySelected = (course: ScheduleCourse2<null>) => {
    return selectedCourses.some((selectedCourse) =>
      isEqualCourses(selectedCourse, course)
    );
  };

  const clearSelectedCourses = () => {
    setSelectedCourses([]);
  };

  return {
    selectedCourses,
    addSelectedCourse,
    removeSelectedCourse,
    isCourseAlreadySelected,
    clearSelectedCourses,
  };
};
