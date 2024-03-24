import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

export const SecondaryButton: ComponentWithAs<"button", ButtonProps> = ({
  ...rest
}) => {
  return (
    <Button
      variant="whiteCancelOutline"
      borderRadius="lg"
      boxShadow="0px 2px 0px 0px #E6E9EE"
      borderColor="#E6E9EE"
      color="neutral.400"
      border="2px"
      {...rest}
    />
  );
};
