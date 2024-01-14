import { StudentModel, PlanModel } from "@graduate/common";
import produce from "immer";

/**
 * Creates a copy of the given student and replaces one of their plans with
 * their given plan.
 */
export const updatePlanForStudent = (
  student: StudentModel<string>,
  newPlan: PlanModel<string>
): StudentModel<string> => {
  const updatedStudent = produce(student, (draftStudent) => {
    const updatedPlanIdx = draftStudent.plans.findIndex(
      (plan) => newPlan.id === plan.id
    );

    if (updatedPlanIdx !== -1) {
      draftStudent.plans[updatedPlanIdx] = newPlan;
    }
  });

  return updatedStudent;
};
