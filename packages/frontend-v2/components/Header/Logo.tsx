import { Heading, HStack } from "@chakra-ui/react";

export const Logo = (): JSX.Element => {
  return (
    <HStack flexDirection="row" alignItems="center" spacing="2px">
      <Heading size="lg" color="primary.red.main" fontFamily="logo">
        Graduate
      </Heading>
      <Heading size="xl" color="primary.blue.dark.main" pb="2%">
        NU
      </Heading>
    </HStack>
  );
};
