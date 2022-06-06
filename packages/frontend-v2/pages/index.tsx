import type { NextPage } from "next";
import { Box, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { PrimaryOutlineButton } from "../components/Buttons/buttons";

const Home: NextPage = () => {
  return (
    <Box>
      <Header />
      <Banner />
      <Info />      
    </Box>
  );
};

const Header = (): JSX.Element => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" 
      pl="1.5%" pr="1.5%" pb="1%" pt="1%" boxShadow="0px 4px 7px lightgrey">
      <Heading size="xl" color="blue.700">GraduateNU</Heading>
      <PrimaryOutlineButton text="Sign In" size="md" />
    </Flex>
  );
}

const Banner = (): JSX.Element => {
  return (
    <Flex pt="3%" height="50%" flexDirection="row" alignItems="center" justifyContent="center">
      <Image ml="-5%" mr="5%" boxSize="600px" src="/husky.svg" alt="husky"/>
      <Flex flexDirection="column" width="35%" alignItems="center">
        <Box>
          <Heading fontSize="7xl" color="primary.main">
            Graduate
          </Heading>
          <Heading fontSize="7xl" color="blue.700">
            your way
          </Heading>
          <Text fontSize="3xl" color="blue.700" pt="4%">
            Navigate the Northeastern graduation requirements and create a personalized plan of study.
          </Text>
        </Box>
        <Box mr="30%" mt="13%">
          <PrimaryOutlineButton text="Get Started" size="md" />
        </Box>
      </Flex>
    </Flex>
  );
}

const Info = (): JSX.Element => {
  return (
    <Flex mt="9%" pt="5%" pb="12%" backgroundColor="blue.50" flexDirection="column" alignItems="center">
      <Heading size="2xl" color="blue.700">How It Works</Heading>
      <SimpleGrid columns={3} pl="13%" pt="7%">
        <Image pt="5%" src="/landing_start.svg" />
        <Image pl="5%" src="/landing_personalize.svg" />
        <Image pt="5%" src="/landing_graduate.svg" />
        <InfoSection title="Start" desc="Just answer a couple questions and get started with a multi-year plan for your classes."/>
        <InfoSection title="Personalize" desc="Pick the classes you want. We'll take care of NU Path, pre-requisites, and everything in between."/>
        <InfoSection title="Graduate" desc="Build a plan of study that lets you graduate faster, with better classes, and a lot less headaches."/>
      </SimpleGrid>
    </Flex>
  );
}

interface InfoSectionProps {
  title: string;
  desc: string;
}

const InfoSection = ({ title, desc }: InfoSectionProps): JSX.Element => {
  return (
    <Box>
      <Heading pt="10%" size="lg" color="blue.700">
        { title }
      </Heading>
      <Text pt="3%" width="55%" color="blue.700" fontWeight="semibold">
        { desc }
      </Text>
    </Box>
  );
}
 

export default Home;
