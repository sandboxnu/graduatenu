import { AbsoluteCenter, Box, Divider, Flex, Heading } from "@chakra-ui/react";
import router from "next/router";
import { FormEventHandler, ReactNode, useContext } from "react";
import { SecondaryBlueButton } from "../Button/SecondaryBlueButton";
import { IsGuestContext } from "../../pages/_app";

type NewType = ReactNode;

interface AuthFormProps {
  onSubmit?: FormEventHandler<HTMLDivElement>;
  headingText: string;
  inputs: ReactNode;
  footer: NewType;
}
export const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  headingText,
  inputs,
  footer,
}) => {
  const { setIsGuest } = useContext(IsGuestContext);
  return (
    <Flex
      as="form"
      onSubmit={onSubmit}
      justifyContent="center"
      alignItems="center"
      height="100%"
      direction="column"
      rowGap="2xl"
      mx="auto"
      w="80%"
      maxW="450px"
    >
      <Heading as="h1" size="xl">
        {headingText}
      </Heading>
      <Flex direction="column" rowGap="md" width="100%">
        {inputs}
      </Flex>
      {footer}
      <Box width="100%" position="relative">
        <Divider width="100%" />
        <AbsoluteCenter bg="white" px="4">
          <b>or</b>
        </AbsoluteCenter>
      </Box>
      <SecondaryBlueButton
        width="100%"
        onClick={() => {
          setIsGuest(true);
          router.push("/home");
        }}
      >
        Continue as Guest
      </SecondaryBlueButton>
    </Flex>
  );
};
