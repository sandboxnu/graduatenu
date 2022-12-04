import { Heading, HStack, Image } from "@chakra-ui/react";

export const Logo = (): JSX.Element => {
  return (
    <HStack alignItems="center" spacing="2xs">
      <Image
        src="/logo.png"
        objectFit="contain"
        boxSize="50"
        alt="GraduateNU logo"
      />
      <HStack alignItems="center" spacing="2px">
        <Heading size="lg" color="primary.red.main" fontFamily="logo">
          Graduate
        </Heading>
        <Heading size="xl" color="primary.blue.dark.main" pb="2%">
          NU
        </Heading>
      </HStack>
    </HStack>
  );
};
