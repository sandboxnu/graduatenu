import { Heading, HStack } from "@chakra-ui/react";

export const Logo = (): JSX.Element => {
  return (
    <HStack flexDirection="row" alignItems="center" spacing="2px">
      <Heading size="lg" color="primary.main" fontFamily="logo">Graduate</Heading>
      <Heading size="xl" color="blue.700" pb="2%">NU</Heading>
    </HStack>
  );

}