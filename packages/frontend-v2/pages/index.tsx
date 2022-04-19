import type { NextPage } from "next";
import { Flex, Heading } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Flex width="full" justifyContent="center" my="xl">
      <Heading color="primary.main" size="xl">
        Graduate NU
      </Heading>
    </Flex>
  );
};

export default Home;
