import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

export const BlueButton: ComponentWithAs<"button", ButtonProps> = ({
  ...rest
}) => {
  return (
    <Button
      border="1px"
      variant="outline"
      borderColor="primary.blue.light.main"
      colorScheme="primary.blue.light"
      color="primary.blue.light.main"
      borderRadius="lg"
      {...rest}
    />
  );
};
