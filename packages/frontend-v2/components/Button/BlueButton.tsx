import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

export const BlueButton: ComponentWithAs<"button", ButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button
      variant="outline"
      borderColor="primary.blue.light.main"
      colorScheme="primary.blue.light"
      color="primary.blue.light.main"
      {...rest}
    >
      {children}
    </Button>
  );
};
