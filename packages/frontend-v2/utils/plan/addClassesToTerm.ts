import { PlanModel, ScheduleCourse2, SeasonEnum } from "@graduate/common";
import produce from "immer";
import { prepareClassesForDnd } from ".";
import { logger } from "../logger";
import { flattenScheduleToTerms } from "./updatePlanOnDragEnd";

export const addClassesToTerm = (
  classes: ScheduleCourse2<null>[],
  termYear: number,
  termSeason: SeasonEnum,
  plan: PlanModel<string>
) => {
  const updatedPlan = produce(plan, (draftPlan) => {
    const schedule = draftPlan.schedule;

    // find the term
    const terms = flattenScheduleToTerms(schedule);
    const term = terms.find(
      (term) => term.year === termYear && term.season === termSeason
    );

    if (!term) {
      const errMsg = "Term with given year and season not found.";
      logger.debug("addClassesToTerm", errMsg, termYear, termSeason, schedule);
      throw new Error("Term with given year and season not found.");
    }

    // populate courses with dnd id
    const courseCount = terms.reduce(
      (count, term) => count + term.classes.length,
      0
    );

    const { dndClasses } = prepareClassesForDnd(classes, courseCount);

    // add the classes to the term
    term.classes.push(...dndClasses);
  });

  return updatedPlan;
};
