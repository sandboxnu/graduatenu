import { PlanModel } from "@graduate/common";
import produce from "immer";

/** Remove the given academic year from the plan. */
export const removeYearFromPlan = (
  plan: PlanModel<string>,
  yearNum: number
): PlanModel<string> => {
  const updatedPlan = produce(plan, (draftPlan) => {
    draftPlan.schedule.years = plan.schedule.years.filter(
      (year) => year.year !== yearNum
    );
  });

  return updatedPlan;
};
