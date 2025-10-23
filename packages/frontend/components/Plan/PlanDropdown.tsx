import React, { Dispatch, SetStateAction } from "react";
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaStar } from "react-icons/fa6";

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
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon boxSize="20px" />}
        borderRadius="lg"
        border="1px"
        variant="outline"
        borderColor="primary.blue.light.main"
        colorScheme="primary.blue.light"
        color="primary.blue.light.main"
      >
        {selectedPlanId
          ? plans.find((p) => p.id === selectedPlanId)?.name
          : "Select Plan"}
      </MenuButton>
      <MenuList>
        {plans.map((plan) => (
          <MenuItem key={plan.id} onClick={() => setSelectedPlanId(plan.id)}>
            <Text flex="1">{plan.name}</Text>
            <Icon
              as={FaStar}
              boxSize="20px"
              ml={5}
              color="primary.blue.light.main"
            />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
