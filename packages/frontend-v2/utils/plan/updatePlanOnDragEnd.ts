import { Active, Over } from "@dnd-kit/core";
import { PlanModel, Schedule2, ScheduleTerm2 } from "@graduate/common";
import produce from "immer";

/**
 * Updates the schedule of plan when a course is dragged from one term to
 * another term by removing the course from the old term and adding it to the new term.
 *
 * The given plan isn't mutated, and a completely new plan is returned.
 *
 * @param   plan
 * @param   draggedCourse   The dnd course being dragged(simply needs to have
 *   the unique dnd id)
 * @param   draggedOverTerm The term the course is being dragged over(simply
 *   needs to have the unique dnd id)
 * @returns                 An updated plan, the original plan remains untouched.
 */
export const updatePlanOnDragEnd = (
  plan: PlanModel<string>,
  draggedCourse: Active,
  draggedOverTerm: Over
): PlanModel<string> => {
  const updatedPlan = produce(plan, (draftPlan) => {
    // grab all the terms across the years, since it's easier to work with a flat list of terms
    const scheduleTerms = flattenScheduleToTerms<string>(draftPlan.schedule);

    const newTerm = scheduleTerms.find(
      (term) => term.id === draggedOverTerm.id
    );

    if (!newTerm) {
      throw new Error("Term the course is dragged over isn't found");
    }

    if (!draggedCourse.data.current?.course) {
      throw new Error(
        "The course being dragged is not found in the term it is being dragged from"
      );
    }

    if (!draggedCourse.data.current.isFromSidebar) {
      // Course is from a term, so we need to move it, we don't need to move
      // courses that are from the sidebar.

      // remove the class from the old term and add it to the new term
      const oldTerm = scheduleTerms.find((term) =>
        term.classes.some((course) => course.id === draggedCourse.id)
      );

      if (!oldTerm) {
        throw new Error("Term the course is dragged from isn't found");
      }

      if (oldTerm === newTerm) {
        // Course is being dragged over its own term, so we do nothing
        return;
      }

      oldTerm.classes = oldTerm.classes.filter(
        (course) => course.id !== draggedCourse.id
      );
    }

    // We set a temporary id to the new class because the plan will provide a new id on rerendering, so it doesn't need to be unique.
    newTerm.classes.push({
      ...draggedCourse.data.current.course,
      id: "moving-course-temp",
    });
  });

  return updatedPlan;
};

/** Flattens a schedule to a list of term that are much easier to work with. */
export const flattenScheduleToTerms = <T>(schedule: Schedule2<T>) => {
  const scheduleTerms: ScheduleTerm2<T>[] = [];
  schedule.years.forEach((year) =>
    scheduleTerms.push(...[year.fall, year.spring, year.summer1, year.summer2])
  );

  return scheduleTerms;
};
