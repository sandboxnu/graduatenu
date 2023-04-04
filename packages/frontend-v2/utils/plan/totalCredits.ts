import { Schedule2, ScheduleYear2 } from "@graduate/common";

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
    // sum all credits over all courses
    const totalCreditsThisTerm = term.classes.reduce(
      (totalCreditsForTerm, course) => {
        return totalCreditsForTerm + course.numCreditsMin;
      },
      0
    );

    return totalCreditsForYear + totalCreditsThisTerm;
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
