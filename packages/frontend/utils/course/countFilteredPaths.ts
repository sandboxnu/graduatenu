import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";

export const countFilteredPaths = (
  course: ScheduleCourse2<null>,
  filteredNuPaths: NUPathEnum[]
): number => {
  if (!course.nupaths) {
    return -1;
  }

  let count = 0;
  course.nupaths.forEach((element) => {
    if (filteredNuPaths.includes(element)) {
      count++;
    }
  });

  return count;
};
