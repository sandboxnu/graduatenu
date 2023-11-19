import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import { GraduatePostAuthHeader } from "../Header";
import { GraduateButtonLink } from "../Link";

export const ClientSideError: React.FC = () => {
  return (
    <Flex flexDirection="column" height="100vh" overflow="hidden">
      <GraduatePostAuthHeader />
      <Flex
        height="100%"
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          width={{ tablet: "lg", base: "xs" }}
          height={{ tablet: "lg", base: "xs" }}
          direction="column"
          alignItems="center"
          rowGap="md"
          p={{ tablet: "2xl", base: "md" }}
        >
          <Image src="/sad_face.svg" alt="sad face" boxSize="7rem" />
          <Heading as="h1" size="xl" color="primary.blue.dark.main">
            Oops! Page not found
          </Heading>
          <Flex
            width={{ base: "md" }}
            height={{ base: "max-content" }}
            direction="column"
            alignItems="center"
            rowGap="sm"
          >
            <Text size="xs" textAlign="center">
              Sorry! We are unable to retrieve the information you need.
            </Text>
            <GraduateButtonLink
              href={
                process.env.NODE_ENV == "development"
                  ? "http://localhost:3002/home"
                  : "https://graduatenu.com/home"
              }
              mt="md"
              variant="solid"
              borderRadius="lg"
              px="3xl"
              py="lg"
            >
              Back to Home
            </GraduateButtonLink>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
