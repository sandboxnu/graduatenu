import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

export const BlueButton: ComponentWithAs<"button", ButtonProps> = ({
  ...rest
}) => {
  return (
    <Button
      variant="outline"
      borderColor="primary.blue.light.main"
      colorScheme="primary.blue.light"
      color="primary.blue.light.main"
      borderRadius="lg"
      {...rest}
    />
  );
};
