import { PlanModel } from "@graduate/common";
import produce from "immer";
import { createEmptyYear } from "./createEmptySchedule";
import { getCourseCount, prepareYearForDnd } from "./preparePlanForDnd";

/** Adds one empty dnd year to an existing plan. */
export const addEmptyDndYearToPlan = (
  plan: PlanModel<string>
): PlanModel<string> => {
  const updatedPlan = produce(plan, (draftPlan) => {
    const schedule = draftPlan.schedule;
    const newYearNum = schedule.years.length + 1;
    const emptyYear = createEmptyYear(newYearNum);
    const { updatedYear: dndEmptyYear } = prepareYearForDnd(
      emptyYear,
      getCourseCount(plan)
    );
    schedule.years.push(dndEmptyYear);
  });

  return updatedPlan;
};
