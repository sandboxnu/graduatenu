import { PlanModel, ScheduleCourse2, SeasonEnum } from "@graduate/common";
import produce from "immer";
import { isEqualCourses } from "../course";
import { findTerm } from "./updatePlanOnDragEnd";

/**
 * Remove the given class from the given term in the plan.
 *
 * @returns The updated plan. The original plan isn't touched and remains unchanged.
 */
export const removeCourseFromTerm = (
  courseToRemove: ScheduleCourse2<unknown>,
  termYear: number,
  termSeason: SeasonEnum,
  plan: PlanModel<string>
): PlanModel<string> => {
  const updatedPlan = produce(plan, (draftPlan) => {
    const schedule = draftPlan.schedule;

    const term = findTerm(termSeason, plan, termYear);

    // remove the course
    term.classes = term.classes.filter(
      (course) => !isEqualCourses(course, courseToRemove)
    );
  });

  return updatedPlan;
};
