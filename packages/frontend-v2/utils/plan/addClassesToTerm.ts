import { PlanModel, ScheduleCourse2, SeasonEnum } from "@graduate/common";
import produce from "immer";
import { prepareClassesForDnd } from ".";
import { logger } from "../logger";
import { flattenScheduleToTerms } from "./updatePlanOnDragEnd";

/**
 * Add the given classes to the given term in the plan.
 *
 * @returns The updated plan. The original plan isn't touched and remains unchanged.
 */
export const addClassesToTerm = (
  classes: ScheduleCourse2<null>[],
  termYear: number,
  termSeason: SeasonEnum,
  plan: PlanModel<string>
) => {
  const updatedPlan = produce(plan, (draftPlan) => {
    const schedule = draftPlan.schedule;
    schedule.years;

    const scheduleYear = schedule.years.find((year) => termYear === year.year);

    if (!scheduleYear) {
      const errMsg = "Term with given year and season not found.";
      logger.debug("addClassesToTerm", errMsg, termYear, termSeason, plan);
      throw new Error("Term with given year and season not found.");
    }

    let term = undefined;

    switch (termSeason) {
      case SeasonEnum.FL:
        term = scheduleYear.fall;
        break;
      case SeasonEnum.SP:
        term = scheduleYear.spring;
        break;
      case SeasonEnum.S1:
        term = scheduleYear.summer1;
        break;
      case SeasonEnum.S2:
        term = scheduleYear.summer2;
        break;
      case SeasonEnum.SM:
        throw new Error(
          "Full summer doesn't exist right now come back when it exists!"
        );
    }

    const seasonEnumToTermSeason = {
      FL: "fall",
      SP: "spring",
      S1: "summer1",
      S2: "summer2",
    };

    // const term = scheduleYear[termSeason]

    // find the term
    // const term = scheduleYear].find(
    //   (termToCheck) => termToCheck.year === termYear && termToCheck.season === termSeason
    // );

    // (term) => {
    //   return term.year === termYear && term.season === termSeason
    // }

    // function test(term) {
    //   return term.year === termYear && term.season === termSeason
    // }

    const terms = flattenScheduleToTerms(schedule);

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
