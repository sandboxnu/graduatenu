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
import { IoIosStar } from "react-icons/io";

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
        width="300px"
      >
        <Text
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          textAlign="left"
        >
          {selectedPlanId
            ? plans.find((p) => p.id === selectedPlanId)?.name
            : "Select Plan"}
        </Text>
      </MenuButton>
      <MenuList width="300px">
        {plans.map((plan) => (
          <MenuItem key={plan.id} onClick={() => setSelectedPlanId(plan.id)}>
            <Text
              flex="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {plan.name}
            </Text>
            {plan.starred && (
              <Icon as={IoIosStar} boxSize="20px" color="yellow.400" />
            )}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
