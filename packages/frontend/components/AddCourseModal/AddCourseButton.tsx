import { AddIcon } from "@chakra-ui/icons";
import { ButtonProps } from "@chakra-ui/react";
import { SecondaryBlueButton } from "../Button/SecondaryBlueButton";

interface AddCourseButtonProps {
  onOpen: () => void;
}

export const AddCourseButton: React.FC<AddCourseButtonProps & ButtonProps> = ({
  onOpen,
  ...buttonProps
}) => {
  return (
    <SecondaryBlueButton
      leftIcon={<AddIcon w={4} h={4} color="primary.blue.light.main" />}
      onClick={onOpen}
      {...buttonProps}
    >
      Add Courses
    </SecondaryBlueButton>
  );
};
