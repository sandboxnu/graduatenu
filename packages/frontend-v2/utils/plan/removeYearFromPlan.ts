import { PlanModel } from "@graduate/common";
import produce from "immer";

/** Remove the given academic year from the plan. */
export const removeYearFromPlan = (
  plan: PlanModel<string>,
  yearNum: number
): PlanModel<string> => {
  const updatedPlan = produce(plan, (draftPlan) => {
    const years = draftPlan.schedule.years;
    // years in the schedule are ordered by their yearNum
    const yearIdx = yearNum - 1;
    if (yearIdx >= years.length) {
      return;
    }

    // remove the year
    draftPlan.schedule.years.splice(yearIdx, 1);

    // re-number all years since a year from the middle could have been taken out
    draftPlan.schedule.years.forEach((year, idx) => {
      year.year = idx + 1;
    });
  });

  return updatedPlan;
};
