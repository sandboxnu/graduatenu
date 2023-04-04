import {
  CreatePlanDtoWithoutSchedule,
  GetSupportedMajorsResponse,
} from "@graduate/common";
import { FormState, UseFormRegister } from "react-hook-form";
import { PlanSelect } from "../Form";

interface PlanConcentrationSelectProps {
  catalogYear?: number;
  majorName?: string;
  supportedMajorsData?: GetSupportedMajorsResponse;
  register: UseFormRegister<any>;
  errors: FormState<CreatePlanDtoWithoutSchedule>["errors"];
}

export const PlanConcentrationsSelect: React.FC<
  PlanConcentrationSelectProps
> = ({ catalogYear, majorName, supportedMajorsData, register, errors }) => {
  const supportedMajor = supportedMajorsData?.supportedMajors[
    catalogYear ?? 0
  ]?.[majorName ?? ""] ?? { concentrations: [], minRequiredConcentrations: 0 };

  if (supportedMajor.concentrations.length === 0) {
    return <></>;
  }

  const isConcentrationRequired = supportedMajor.minRequiredConcentrations > 0;

  const validateConcentrations =
    isConcentrationRequired &&
    register("concentration", {
      required: "Concentration is required",
    });

  return (
    <PlanSelect
      label="Concentrations"
      id="concentration"
      placeholder="Select a Concentration"
      error={errors.major}
      array={supportedMajor.concentrations}
      {...validateConcentrations}
    />
  );
};
