import { PlanModel, SeasonEnum } from "@graduate/common";
import { logger } from "../logger";

/** Finds a current term and season from a year and plan */
export const findTerm = (
  termSeason: SeasonEnum,
  plan: PlanModel<string>,
  termYear: number
) => {
  const scheduleYear = plan.schedule.years.find(
    (year) => termYear === year.year
  );

  if (!scheduleYear) {
    const errMsg = "Term with given year and season not found.";
    logger.debug("UpdatePlanOnDragEnd.ts", errMsg, termYear, termSeason, plan);
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
  return term;
};
