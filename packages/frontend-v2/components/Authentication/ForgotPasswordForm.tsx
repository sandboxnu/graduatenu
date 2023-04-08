import { Flex, Heading, Text } from "@chakra-ui/react";
import { FormEventHandler, ReactNode } from "react";

interface ForgotPasswordFormProps {
  onSubmit?: FormEventHandler<HTMLDivElement>;
  headingText: string;
  subheaderText: string;
  mainContent: ReactNode;
  footer: ReactNode;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  headingText,
  subheaderText,
  mainContent,
  footer,
}) => {
  return (
    <Flex
      shadow="2xl"
      px="4xl"
      py="2xl"
      borderRadius="2xl"
      width="xl"
      justifyContent="center"
      as="form"
      onSubmit={onSubmit}
      alignItems="center"
      direction="column"
      rowGap="2xl"
    >
      <Flex direction="column" alignItems="center" rowGap="sm">
        <Heading as="h1" size="xl">
          {headingText}
        </Heading>
        <Text size="xs" textAlign="center">
          {subheaderText}
        </Text>
      </Flex>
      <Flex direction="column" width="100%" rowGap="md">
        {mainContent}
      </Flex>
      {footer}
    </Flex>
  );
};
