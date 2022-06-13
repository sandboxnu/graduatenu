import type { NextPage } from "next";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Logo, HeaderContainer } from "../components";

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
    <HeaderContainer>
      <Logo />
      <Button size="sm">Sign In</Button>
    </HeaderContainer>
  );
};

const Banner = (): JSX.Element => {
  return (
    <Box
      pt={{ desktop: "75px", laptop: "50px", tablet: "40px" }}
      pb={{ desktop: "175px", laptop: "150px", tablet: "100px" }}
    >
      <HStack
        spacing={{ desktop: "100px", laptop: "75px", tablet: "50px" }}
        justifyContent="center"
      >
        <Image
          boxSize={{ desktop: "550px", laptop: "500px", tablet: "400px" }}
          src="/husky.svg"
          alt="husky"
        />
        <Flex w="35%" flexDirection="column" alignItems="center">
          <Box>
            <Heading
              fontSize={{ desktop: "7xl", laptop: "6xl", tablet: "5xl" }}
              color="primary.main"
            >
              Graduate
            </Heading>
            <Heading
              fontSize={{ desktop: "7xl", laptop: "6xl", tablet: "5xl" }}
              color="blue.700"
            >
              your way
            </Heading>
            <Text
              pt="5%"
              fontSize={{ desktop: "3xl", laptop: "2xl", tablet: "xl" }}
              color="blue.700"
            >
              Navigate the Northeastern graduation requirements and create a
              personalized plan of study.
            </Text>
          </Box>
          <Button
            mr={{ desktop: "120px", laptop: "100px", tablet: "50px" }}
            mt="15%"
          >
            Get Started
          </Button>
        </Flex>
      </HStack>
    </Box>
  );
};

const Info = (): JSX.Element => {
  const infoImageData = [
    {
      imageSource: "/landing_start.svg",
      altInfo: "Start",
    },
    {
      imageSource: "/landing_personalize.svg",
      altInfo: "Personalize",
    },
    {
      imageSource: "/landing_graduate.svg",
      altInfo: "Graduate",
    },
  ];
  const infoSectionData = [
    {
      title: "Start",
      description:
        "Just answer a couple questions and get started with a multi-year plan for your classes.",
    },
    {
      title: "Personalize",
      description:
        "Pick the classes you want. We'll take care of NU Path, pre-requisites, and everything in between.",
    },
    {
      title: "Graduate",
      description:
        "Build a plan of study that lets you graduate faster, with better classes, and a lot less headaches.",
    },
  ];

  return (
    <Box
      pt={{ desktop: "95px", laptop: "100px", tablet: "75px" }}
      pb={{ desktop: "125px", laptop: "130px", tablet: "105px" }}
      backgroundColor="blue.50"
    >
      <VStack>
        <Heading
          mb={{ desktop: "95px", laptop: "75px", tablet: "65px" }}
          size="2xl"
          color="blue.700"
        >
          How It Works
        </Heading>
        <SimpleGrid columns={3} justifyItems="center" pl="5%" pr="5%">
          {infoImageData.map((info) => (
            <InfoImage imageSource={info.imageSource} altInfo={info.altInfo} />
          ))}
          {infoSectionData.map((info) => (
            <InfoSection title={info.title} description={info.description} />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

interface InfoImageProps {
  imageSource: string;
  altInfo: string;
}

const InfoImage = ({ imageSource, altInfo }: InfoImageProps): JSX.Element => {
  return (
    <Image
      boxSize={{ desktop: "250px", laptop: "200px", tablet: "150px" }}
      pt="5%"
      pb="5%"
      src={imageSource}
      alt={altInfo}
    />
  );
};

interface InfoSectionProps {
  title: string;
  description: string;
}

const InfoSection = ({ title, description }: InfoSectionProps): JSX.Element => {
  return (
    <Box w="55%">
      <Heading
        pt="10%"
        fontSize={{ desktop: "3xl", laptop: "2xl", tablet: "xl" }}
        color="blue.700"
      >
        {title}
      </Heading>
      <Text pt="3%" color="blue.700" fontWeight="semibold">
        {description}
      </Text>
    </Box>
  );
};

export default Home;
