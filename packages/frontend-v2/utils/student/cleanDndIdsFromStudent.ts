import { StudentModel } from "@graduate/common";
import { cleanDndIdsFromPlan } from "../plan";

export const cleanDndIdsFromStudent = (
  student: StudentModel<string>
): StudentModel<null> => {
  const cleanPlans = student.plans.map(cleanDndIdsFromPlan);
  return {
    ...student,
    plans: cleanPlans,
  };
};
