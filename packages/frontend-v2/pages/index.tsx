import type { NextPage } from "next";
import { Box, Button, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";

const Home: NextPage = () => {

  // ya overall this stuff is messy, todo: clean this up and make things more consistent, rn its a lot of arbitrary
  // padding and margins T-T, also need to import new font for logo
  return (
    <Box>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" paddingLeft="1.5%" paddingRight="1.5%"
      paddingBottom="1%" paddingTop="1%" boxShadow="0px 4px 7px lightgrey">
        <Heading size="xl" color="blue.700">GraduateNU</Heading>
        <Button size="lg" color="primary.main" colorScheme="primary" variant="outline">
          Sign In
        </Button>
      </Flex>

      <Flex paddingTop="3%" height="50%" flexDirection="row" alignItems="center" justifyContent="center">
        <Image marginLeft="-5%" marginRight="5%" boxSize="600px" src="/husky.svg" alt="husky"/>
        <Flex flexDirection="column" width="35%" alignItems="center">
          <Box>
            <Heading  fontSize="7xl" color="primary.main">
              Graduate
            </Heading>
            <Heading fontSize="7xl" color="blue.700">
              your way
            </Heading>
            <Text fontSize="3xl" color="blue.700" paddingTop="4%">
              Navigate the Northeastern graduation requirements and create a personalized plan of study.
            </Text>
          </Box>
          <Button marginRight="30%" marginTop="13%" size="lg" color="primary.main" colorScheme="primary" variant="outline" width="25%">
            Get Started
          </Button>
        </Flex>
      </Flex>
      <Flex marginTop="9%" paddingTop="5%" paddingBottom="12%" backgroundColor="blue.50" flexDirection="column" alignItems="center">
        <Heading size="2xl" color="blue.700">How It Works</Heading>
        <SimpleGrid columns={3} paddingLeft="13%" paddingTop="7%">
          <Image paddingTop="5%" src="/landing_start.svg" />
          <Image paddingLeft="5%" src="/landing_personalize.svg" />
          <Image paddingTop="5%" src="/landing_graduate.svg" />
          {/** TODO: turn these into components? */}
          <Box>
            <Heading paddingTop="10%" size="lg" color="blue.700">Start</Heading>
            <Text paddingTop="3%" width="55%" color="blue.700" fontWeight="semibold">Just answer a couple questions and get started with a multi-year plan for your classes.</Text>
          </Box>
          <Box>
            <Heading paddingTop="10%" size="lg" color="blue.700">Personalize</Heading>
            <Text paddingTop="3%" width="55%" color="blue.700" fontWeight="semibold">Pick the classes you want. We'll take care of NU Path, pre-requisites, and everything in between.</Text>
          </Box>
          <Box>
            <Heading paddingTop="10%" size="lg" color="blue.700">Graduate</Heading>
            <Text paddingTop="3%" width="55%" color="blue.700" fontWeight="semibold">Build a plan of study that lets you graduate faster, with better classes, and a lot less headaches.</Text>
          </Box>
        </SimpleGrid>
      </Flex>
    </Box>
  );

};

export default Home;
