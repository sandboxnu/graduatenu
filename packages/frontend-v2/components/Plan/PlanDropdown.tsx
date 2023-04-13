import React, { Dispatch, SetStateAction } from "react";
import { Select } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";

interface PlanDropdownProps {
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
  plans: PlanModel<string>[];
  selectedPlanId: number | undefined | null;
}
export const PlanDropdown: React.FC<PlanDropdownProps> = ({
  setSelectedPlanId,
  plans,
  selectedPlanId,
}) => {
  return (
    <Select
      placeholder="Select Plan"
      width="30%"
      borderRadius="lg"
      value={selectedPlanId ? selectedPlanId : undefined}
      onChange={(e) => {
        if (!e.target.value) {
          // no plan is selected, indicated using null(different from undef which is the initial state)
          setSelectedPlanId(null);
          return;
        }

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
