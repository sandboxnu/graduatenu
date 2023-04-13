import { Schedule2, ScheduleTerm2, ScheduleYear2 } from "@graduate/common";

/** The credits for all courses in a term. */
export const totalCreditsInTerm = (term: ScheduleTerm2<unknown>): number => {
  return term.classes.reduce((totalCreditsForTerm, course) => {
    return totalCreditsForTerm + course.numCreditsMin;
  }, 0);
};

/** The credits for all courses in a year summed. */
export const totalCreditsInYear = (
  scheduleYear: ScheduleYear2<unknown>
): number => {
  return [
    scheduleYear.fall,
    scheduleYear.spring,
    scheduleYear.summer1,
    scheduleYear.summer2,
  ].reduce((totalCreditsForYear, term) => {
    return totalCreditsForYear + totalCreditsInTerm(term);
  }, 0);
};

/** The credits for all courses in a schedule summed. */
export const totalCreditsInSchedule = (
  schedule: Schedule2<unknown>
): number => {
  return (
    schedule.years.reduce(
      (totalCredits, year) => totalCreditsInYear(year) + totalCredits,
      0
    ) ?? 0
  );
};
