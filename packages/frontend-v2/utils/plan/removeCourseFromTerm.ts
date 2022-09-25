import { PlanModel, ScheduleCourse2, SeasonEnum } from "@graduate/common";
import produce from "immer";
import { isEqualCourses } from "../course";
import { logger } from "../logger";
import { flattenScheduleToTerms } from "./updatePlanOnDragEnd";

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

    // find the term
    const terms = flattenScheduleToTerms(schedule);
    const term = terms.find(
      (term) => term.year === termYear && term.season === termSeason
    );

    if (!term) {
      const errMsg = "Term with given year and season not found.";
      logger.debug("removeCourseFromTerm", errMsg, termYear, termSeason, plan);
      throw new Error("Term with given year and season not found.");
    }

    // remove the course
    term.classes = term.classes.filter(
      (course) => !isEqualCourses(course, courseToRemove)
    );
  });

  return updatedPlan;
};
