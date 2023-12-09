import { ButtonProps, Button, ComponentWithAs } from "@chakra-ui/react";

export const SecondaryBlueButton: ComponentWithAs<"button", ButtonProps> = ({
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
    />
  );
};
