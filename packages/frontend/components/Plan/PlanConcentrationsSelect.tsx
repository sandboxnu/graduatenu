import { GetSupportedMajorsResponse } from "@graduate/common";
import { Control } from "react-hook-form";
import { PlanSelect } from "../Form";

interface PlanConcentrationSelectProps {
  catalogYear?: number;
  majorName?: string;
  supportedMajorsData?: GetSupportedMajorsResponse;
  control: Control<any>;
}

export const PlanConcentrationsSelect: React.FC<
  PlanConcentrationSelectProps
> = ({ catalogYear, majorName, supportedMajorsData, control }) => {
  const supportedMajor = supportedMajorsData?.supportedMajors[
    catalogYear ?? 0
  ]?.[majorName ?? ""] ?? { concentrations: [], minRequiredConcentrations: 0 };

  if (supportedMajor.concentrations.length === 0) {
    return <></>;
  }

  const isConcentrationRequired = supportedMajor.minRequiredConcentrations > 0;

  return (
    <PlanSelect
      label="Concentration"
      placeholder="Select a Concentration"
      name="concentration"
      options={supportedMajor.concentrations}
      control={control}
      rules={{
        required: isConcentrationRequired && "Concentration is required",
      }}
    />
  );
};
