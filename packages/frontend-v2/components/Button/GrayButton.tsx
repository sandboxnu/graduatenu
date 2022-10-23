import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

export const GrayButton: ComponentWithAs<"button", ButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button
      variant="outline"
      borderColor="neutral.900"
      colorScheme="neutral"
      color="black"
      {...rest}
    >
      {children}
    </Button>
  );
};
