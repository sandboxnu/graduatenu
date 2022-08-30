import { DeleteIcon } from "@chakra-ui/icons";
import { ComponentWithAs, IconButton, IconButtonProps } from "@chakra-ui/react";

type CourseTrashButtonType = ComponentWithAs<
  "button",
  Omit<IconButtonProps, "aria-label">
>;

export const CourseTrashButton: CourseTrashButtonType = ({
  onClick,
  ...rest
}) => {
  return (
    <IconButton
      aria-label="Delete course"
      icon={<DeleteIcon />}
      variant="ghost"
      color="primary.blue.light.main"
      colorScheme="primary.blue.light"
      borderRadius="3xl"
      _hover={{ backgroundColor: "neutral.900" }}
      size="sm"
      onClick={onClick}
      {...rest}
    />
  );
};
