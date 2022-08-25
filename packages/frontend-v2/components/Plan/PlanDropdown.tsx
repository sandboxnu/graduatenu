import React, { Dispatch, SetStateAction } from "react";
import { Select } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";

interface PlanDropdownProps {
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined>>;
  plans: PlanModel<string>[];
  selectedPlanId?: number;
}
export const PlanDropdown: React.FC<PlanDropdownProps> = ({
  setSelectedPlanId,
  plans,
  selectedPlanId,
}) => {
  return (
    <Select
      placeholder="Select Plan"
      width="15%"
      mb="sm"
      borderRadius="0"
      value={selectedPlanId}
      onChange={(e) => {
        const selectedPlanId = parseInt(e.target.value);
        setSelectedPlanId(selectedPlanId);
      }}
    >
      {plans.map((plan) => (
        <option value={plan.id} key={plan.id}>
          {plan.name}
        </option>
      ))}
    </Select>
  );
};
