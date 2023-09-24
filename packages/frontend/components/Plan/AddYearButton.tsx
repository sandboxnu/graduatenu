import { PlanModel } from "@graduate/common";
import { addEmptyDndYearToPlan } from "../../utils";
import { BlueButton } from "../Button";

interface AddYearButton {
  plan: PlanModel<string>;
  mutateStudentWithUpdatedPlan: (updatedPlan: PlanModel<string>) => void;
}

export const AddYearButton: React.FC<AddYearButton> = ({
  plan,
  mutateStudentWithUpdatedPlan,
}) => {
  const addYear = () => {
    const updatedPlan = addEmptyDndYearToPlan(plan);
    mutateStudentWithUpdatedPlan(updatedPlan);
  };
  return <BlueButton onClick={addYear}>Add Year</BlueButton>;
};
