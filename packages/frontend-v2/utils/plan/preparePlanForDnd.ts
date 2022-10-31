import {
  PlanModel,
  ScheduleYear2,
  Schedule2,
  ScheduleTerm2,
  ScheduleCourse2,
} from "@graduate/common";

/**
 * Prepares a plan for drag and drop by adding drag and drop ids to semester
 * terms and courses.
 *
 * Term and courses need drag and drop ids since they behave as droppable and
 * draggable components respectively.
 */
export const preparePlanForDnd = (plan: PlanModel<null>): PlanModel<string> => {
  let courseCount = 0;
  const dndYears: ScheduleYear2<string>[] = [];
  plan.schedule.years.forEach((year) => {
    const { updatedCount, updatedYear } = prepareYearForDnd(year, courseCount);
    courseCount = updatedCount;
    dndYears.push(updatedYear);
  });

  const dndSchedule: Schedule2<string> = {
    ...plan.schedule,
    years: dndYears,
  };

  const dndPlan: PlanModel<string> = {
    ...plan,
    schedule: dndSchedule,
  };

  return dndPlan;
};

export const prepareYearForDnd = (
  year: ScheduleYear2<null>,
  courseCount: number
) => {
  let res;
  let updatedCount = courseCount;
  res = prepareTermForDnd(year.fall, courseCount);
  const dndFallTerm = res.dndTerm;
  updatedCount = res.updatedCount;

  res = prepareTermForDnd(year.spring, courseCount);
  const dndSpringTerm = res.dndTerm;
  updatedCount = res.updatedCount;

  res = prepareTermForDnd(year.summer1, courseCount);
  const dndSummer1Term = res.dndTerm;
  updatedCount = res.updatedCount;

  res = prepareTermForDnd(year.summer2, courseCount);
  const dndSummer2Term = res.dndTerm;
  updatedCount = res.updatedCount;

  const updatedYear = {
    ...year,
    fall: dndFallTerm,
    spring: dndSpringTerm,
    summer1: dndSummer1Term,
    summer2: dndSummer2Term,
  };

  return {
    updatedCount,
    updatedYear,
  };
};

/**
 * Prepares a term for drag and drop by adding a unique id to the term and to
 * all of the courses within the term.
 *
 * @param   term        The term to prepare for dnd
 * @param   courseCount The count to start from, used to ensure that all courses
 *   get a unique id
 * @returns             The term tansformed for drag and drop along with the
 *   updated course count which can be used to prepare the next term
 */
const prepareTermForDnd = (
  term: ScheduleTerm2<null>,
  courseCount: number
): { dndTerm: ScheduleTerm2<string>; updatedCount: number } => {
  /*
   * course count shouldn't be needed since in most cases a course will appear only once in a plan,
   * however we don't enforce that by any means so it's good to be safe
   */

  // add a unique dnd id to all courses within the term
  const { dndClasses, updatedCount } = prepareClassesForDnd(
    term.classes,
    courseCount
  );

  const dndTerm = {
    ...term,
    id: `${term.year}-${term.season}`, // add a unique dnd id to all terms
    classes: dndClasses,
  };

  return {
    dndTerm,
    updatedCount,
  };
};

/** Adds a unique dnd id to all the given courses. */
export const prepareClassesForDnd = (
  classes: ScheduleCourse2<null>[],
  courseCount: number
): { dndClasses: ScheduleCourse2<string>[]; updatedCount: number } => {
  let updatedCount = courseCount;
  const dndClasses = classes.map((course) => {
    updatedCount++;
    return {
      ...course,
      id: `${course.classId}-${course.subject}-${updatedCount}`,
    };
  });

  return { dndClasses, updatedCount };
};

export const getCourseCount = (plan: PlanModel<unknown>) => {
  return plan.schedule.years.reduce(
    (count, year) =>
      count +
      year.fall.classes.length +
      year.spring.classes.length +
      year.summer1.classes.length +
      year.summer2.classes.length,
    0
  );
};
