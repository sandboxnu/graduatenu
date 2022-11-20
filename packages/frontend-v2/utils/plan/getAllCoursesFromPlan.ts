import { PlanModel, ScheduleCourse2 } from "@graduate/common";

const YearSeasons: ("fall" | "spring" | "summer1" | "summer2")[] = [
  "fall",
  "spring",
  "summer1",
  "summer2",
];

/**
 * Gets all courses from the given plan. Courses taken multiple times are
 * included in the result multiple times.
 *
 * @param   plan The plan to pull courses from.
 * @returns      All courses in the plan.
 */
export const getAllCoursesFromPlan = (
  plan: PlanModel<string>
): ScheduleCourse2<unknown>[] => {
  const courses: ScheduleCourse2<unknown>[] = [];
  plan.schedule.years.forEach((year) => {
    YearSeasons.forEach((season) => {
      year[season].classes.forEach((course) => {
        courses.push(course);
      });
    });
  });
  return courses;
};
