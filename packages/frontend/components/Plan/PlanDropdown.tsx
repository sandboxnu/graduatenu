import React, { Dispatch, SetStateAction } from "react";
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

interface PlanDropdownProps {
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
  plans: PlanModel<string>[];
  selectedPlanId: number | undefined | null;
  starredPlan: number | undefined;
  updateStarredPlan: (updatedStarredPlan: number | undefined) => void;
}
export const PlanDropdown: React.FC<PlanDropdownProps> = ({
  setSelectedPlanId,
  plans,
  selectedPlanId,
  starredPlan,
  updateStarredPlan,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <MenuButton
        as={Button}
        rightIcon={
          isOpen ? (
            <ChevronUpIcon boxSize="20px" />
          ) : (
            <ChevronDownIcon boxSize="20px" />
          )
        }
        borderRadius="lg"
        border="1px"
        variant="outline"
        borderColor="primary.blue.light.main"
        colorScheme="none"
        color="black"
        width="300px"
        fontWeight="base"
      >
        {selectedPlanId
          ? plans.find((p) => p.id === selectedPlanId)?.name
          : "Select Plan"}
      </MenuButton>

      <MenuList>
        {plans.map((plan) => (
          <MenuItem
            key={plan.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setSelectedPlanId(plan.id)}
            width="300px"
          >
            <Text
              flex={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {plan.name}
            </Text>
            <Icon
              as={
                plan.id && plan.id === starredPlan
                  ? IoIosStar
                  : IoIosStarOutline
              }
              boxSize="24px"
              color={plan.id === starredPlan ? "yellow.400" : "neutral.400"}
              transition="all 0.3s ease"
              onClick={(e) => {
                e.stopPropagation();
                updateStarredPlan(plan.id);
              }}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
