import { AddIcon } from "@chakra-ui/icons";
import { Button, ButtonProps } from "@chakra-ui/react";

interface AddCourseButtonProps {
  onOpen: () => void;
}

export const AddCourseButton: React.FC<AddCourseButtonProps & ButtonProps> = ({
  onOpen,
  ...buttonProps
}) => {
  const hoverStyle = {
    backgroundColor: "neutral.700",
    borderColor: "neutral.900",
  };

  return (
    <Button
      leftIcon={<AddIcon w={4} h={4} color="primary.blue.light.main" />}
      onClick={onOpen}
      size="md"
      margin="0"
      borderRadius="10px"
      borderColor="neutral.main"
      backgroundColor="neutral.main"
      _hover={hoverStyle}
      _active={hoverStyle}
      color="primary.blue.light.main"
      {...buttonProps}
    >
      Add Course
    </Button>
  );
};
