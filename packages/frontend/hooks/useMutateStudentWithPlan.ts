import {
  PlanModel,
  ScheduleCourse2,
  SeasonEnum,
  StudentModel,
} from "@graduate/common";
import {
  addClassesToTerm,
  cleanDndIdsFromPlan,
  handleApiClientError,
  updatePlanForStudent,
} from "../utils";
import { API } from "@graduate/api-client";
import router from "next/router";
import { fetchStudentAndPrepareForDnd } from "./useStudentWithPlans";
import { KeyedMutator } from "swr";

/** Specifies the classes that need to be added to a specific term year and season. */
export interface ClassesToAddBundle {
  classes: ScheduleCourse2<null>[];
  termYear: number;
  termSeason: SeasonEnum;
}

export const useMutateStudentWithPlan = (
  isGuest: boolean,
  student: StudentModel<string> | undefined,
  mutateStudent: KeyedMutator<StudentModel<string>>,
  plan: PlanModel<string> | null
) => {
  /**
   * POSTs the new plan, optimistically updates the SWR cache for student, and
   * rollbacks on error.
   */
  const mutateStudentWithUpdatedPlan = (updatedPlan: PlanModel<string>) => {
    if (!student) return;

    // create a new student object with this updated plan so that we can do an optimistic update till the API returns
    const updatedStudent = updatePlanForStudent(student, updatedPlan);

    mutateStudent(
      async () => {
        // remove dnd ids, update the plan, and refetch the student
        const cleanedPlan = cleanDndIdsFromPlan(updatedPlan);
        if (isGuest) {
          const cleanedPlanWithUpdatedTimeStamp: PlanModel<null> = {
            ...cleanedPlan,
            updatedAt: new Date(),
          };
          window.localStorage.setItem(
            "student",
            JSON.stringify({
              ...student,
              plans: student.plans.map((plan) =>
                plan.id === cleanedPlanWithUpdatedTimeStamp.id
                  ? cleanedPlanWithUpdatedTimeStamp
                  : plan
              ),
            })
          );
        } else {
          await API.plans.update(updatedPlan.id, cleanedPlan);
        }
        return fetchStudentAndPrepareForDnd(isGuest);
      },
      {
        optimisticData: updatedStudent,
        rollbackOnError: true,
        revalidate: false,
      }
    ).catch((error) => {
      handleApiClientError(error, router);
    });
  };

  /** Adds classes to a specified term in the given plan. */
  const addClassesToTermInCurrentPlan = (
    classes: ScheduleCourse2<null>[],
    termYear: number,
    termSeason: SeasonEnum
  ) => {
    if (!plan) return;

    const updatedPlan = addClassesToTerm(classes, termYear, termSeason, plan);
    mutateStudentWithUpdatedPlan(updatedPlan);
  };

  /**
   * Accepts multiple class, term year, and term season values as the payload
   * and adds all the classes to the specified terms in the current plan. This
   * method is a solution to the problem of adding classes altogether from
   * various terms because multiple addClassesToTermInCurrentPlan does not work.
   */
  const addAllClassesToTermsInCurrentPlan = (
    classesToAddPayload: ClassesToAddBundle[]
  ) => {
    if (!plan) return;
    let updatedPlan = plan;
    classesToAddPayload.forEach((classesToAdd) => {
      updatedPlan = addClassesToTerm(
        classesToAdd.classes,
        classesToAdd.termYear,
        classesToAdd.termSeason,
        updatedPlan
      );
    });
    mutateStudentWithUpdatedPlan(updatedPlan);
  };

  return {
    addClassesToTermInCurrentPlan,
    addAllClassesToTermsInCurrentPlan,
  };
};
