import { StudentModel, PlanModel } from "@graduate/common";

/**
 * Creates a copy of the given student and replaces one of their plans with
 * their given plan.
 */
export const updatePlanForStudent = (
  student: StudentModel<string>,
  newPlan: PlanModel<string>
): StudentModel<string> => {
  const updatedPlanIdx = student.plans.findIndex(
    (plan) => newPlan.id === plan.id
  );

  const newPlans = [...student.plans];
  if (updatedPlanIdx !== -1) {
    newPlans[updatedPlanIdx] = newPlan;
  }

  const updatedStudent = {
    ...student,
    plans: newPlans,
  };

  return updatedStudent;
};
