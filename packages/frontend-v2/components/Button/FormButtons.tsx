import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

export const SubmitButton: ComponentWithAs<"button", ButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button
      variant="solid"
      borderRadius="none"
      {...rest}
    >
      {children}
    </Button>
  );
};

export const AlterSubmitButton: ComponentWithAs<"button", ButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button
      variant="solid"
      borderRadius="none"
      borderColor="primary.blue.dark.main"
      colorScheme="primary.blue.dark"
      color="neutral.main"
      backgroundColor='primary.blue.dark.main'
      {...rest}
    >
      {children}
    </Button>
  );
};
