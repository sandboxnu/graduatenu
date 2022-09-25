import { PlanModel, ScheduleTerm2 } from "@graduate/common";

/** Removes all ids used for drag and drop purposes from a plan. */
export const cleanDndIdsFromPlan = (
  plan: PlanModel<string>
): PlanModel<null> => {
  const cleanedYears = plan.schedule.years.map((year) => {
    return {
      ...year,
      fall: cleanDndIdsFromTerm(year.fall),
      spring: cleanDndIdsFromTerm(year.spring),
      summer1: cleanDndIdsFromTerm(year.summer1),
      summer2: cleanDndIdsFromTerm(year.summer2),
    };
  });

  const cleanedPlan: PlanModel<null> = {
    ...plan,
    schedule: {
      ...plan.schedule,
      years: cleanedYears,
    },
  };

  return cleanedPlan;
};

const cleanDndIdsFromTerm = (
  term: ScheduleTerm2<string>
): ScheduleTerm2<null> => {
  const cleanedClasses = term.classes.map((course) => {
    return {
      ...course,
      id: null,
    };
  });

  return {
    ...term,
    id: null,
    classes: cleanedClasses,
  };
};
