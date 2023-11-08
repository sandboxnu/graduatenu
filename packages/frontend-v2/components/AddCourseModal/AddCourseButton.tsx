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
    borderColor: "neutral.300",
  };

  const activeStyle = {
    backgroundColor: "neutral.200",
    borderColor: "neutral.200",
  };

  return (
    <Button
      leftIcon={<AddIcon w={4} h={4} color="primary.blue.light.main" />}
      onClick={onOpen}
      size="md"
      margin="0"
      borderRadius="10px"
      border="1px"
      borderColor="neutral.50"
      backgroundColor="neutral.50"
      boxShadow="sm"
      _hover={hoverStyle}
      _active={activeStyle}
      color="primary.blue.light.main"
      {...buttonProps}
    >
      Add Courses
    </Button>
  );
};
