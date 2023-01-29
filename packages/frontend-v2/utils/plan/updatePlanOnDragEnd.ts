import { Active, Over } from "@dnd-kit/core";
import {
  PlanModel,
  Schedule2,
  ScheduleCourse2,
  ScheduleTerm2,
  SeasonEnum,
} from "@graduate/common";
import produce from "immer";
import { toast } from "react-toastify";
import { getCourseDisplayString } from "../course";
import { getSeasonDisplayWord } from "./getSeasonDisplayWord";
import { isCourseInTerm } from "./isCourseInTerm";
import { logger } from "../logger";
import { TEMPORARY_REDIRECT_STATUS } from "next/dist/shared/lib/constants";

/**
 * Updates the schedule of plan when a course is dragged from one term to
 * another term by removing the course from the old term and adding it to the new term.
 *
 * Throws an error if no change should be made.
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
      throw new Error("Term of the course that is dragged over isn't found");
    }

    console.log(plan);

    const year = plan.schedule.years.find((year) => {
      console.log(year);
      const res = Object.values(year).find((term) => term.id === newTerm.id);
      return res;
    });

    if (!year) {
      throw new Error("Year of the course that is dragged over isn't found");
    }

    if (!draggedCourse.data.current?.course) {
      throw new Error(
        "The course being dragged is not found in the term it is being dragged from"
      );
    }

    const draggedCourseDetails: ScheduleCourse2<unknown> =
      draggedCourse.data.current.course;

    const oldTerm = scheduleTerms.find((term) =>
      term.classes.some((course) => course.id === draggedCourse.id)
    );

    const isFromSidebar = draggedCourse.data.current.isFromSidebar;
    const isSameTerm = !isFromSidebar && oldTerm && oldTerm.id === newTerm.id;

    /*
     * Prevent duplicate courses in the same term,
     * don't need to display error if course is not changing terms.
     */
    if (
      isCourseInTerm(
        draggedCourseDetails.classId,
        draggedCourseDetails.subject,
        newTerm
      ) &&
      !isSameTerm
    ) {
      toast.error(
        `Oops, ${getCourseDisplayString(
          draggedCourseDetails
        )} already exists in Year ${year.year}, ${getSeasonDisplayWord(
          newTerm.season
        )}.`
      );
      throw new Error("Duplicate course in term.");
    }

    /*
     * Course is from a term, so we need to move it, we don't need to move
     * courses that are from the sidebar.
     */
    if (!isFromSidebar) {
      if (!oldTerm) {
        throw new Error("Term the course is dragged from isn't found");
      }

      if (isSameTerm) {
        throw new Error("Course is being dragged over its own term");
      }

      // remove the class from the old term and add it to the new term
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
