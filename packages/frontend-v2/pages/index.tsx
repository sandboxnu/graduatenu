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
import Link from "next/link";
import { GraduateHeader } from "../components/Header/GraduateHeader";

type InfoSectionProps = InfoImageProps & InfoTextProps;

interface InfoImageProps {
  imageSource: string;
  altInfo: string;
}

interface InfoTextProps {
  title: string;
  description: string;
}

const LandingPage: NextPage = () => {
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
    <GraduateHeader
      rightContent={
        <Link href="/login" passHref>
          <Button size="sm">Sign In</Button>
        </Link>
      }
    />
  );
};

const Banner = (): JSX.Element => {
  return (
    <Box
      pt={{ desktop: "5rem", laptop: "3rem", tablet: "2.5rem" }}
      pb={{ desktop: "11rem", laptop: "9rem", tablet: "6.25rem" }}
    >
      <HStack
        spacing={{ desktop: "6.25rem", laptop: "5rem", tablet: "3rem" }}
        justifyContent="center"
      >
        <Image
          boxSize={{ desktop: "34.25rem", laptop: "31.25rem", tablet: "25rem" }}
          src="/husky.svg"
          alt="husky"
        />
        <Flex w="35%" flexDirection="column" alignItems="center">
          <Box>
            <Heading
              fontSize={{ desktop: "7xl", laptop: "6xl", tablet: "5xl" }}
              color="primary.red.main"
            >
              Graduate
            </Heading>
            <Heading
              fontSize={{ desktop: "7xl", laptop: "6xl", tablet: "5xl" }}
              color="primary.blue.dark.main"
            >
              your way
            </Heading>
            <Text
              pt="5%"
              fontSize={{ desktop: "3xl", laptop: "2xl", tablet: "xl" }}
              color="primary.blue.dark.main"
            >
              Navigate the Northeastern graduation requirements and create a
              personalized plan of study.
            </Text>
          </Box>
          <Link href="/signup" passHref>
            <Button
              mr={{ desktop: "7.5rem", laptop: "6.25rem", tablet: "3.25rem" }}
              mt="15%"
            >
              Get Started
            </Button>
          </Link>
        </Flex>
      </HStack>
    </Box>
  );
};

const Info = (): JSX.Element => {
  const infoSectionData = [
    {
      imageSource: "/landing_start.svg",
      altInfo: "Start",
      title: "Start",
      description:
        "Just answer a couple questions and get started with a multi-year plan for your classes.",
    },
    {
      imageSource: "/landing_personalize.svg",
      altInfo: "Personalize",
      title: "Personalize",
      description:
        "Pick the classes you want. We'll take care of NU Path, pre-requisites, and everything in between.",
    },
    {
      imageSource: "/landing_graduate.svg",
      altInfo: "Graduate",
      title: "Graduate",
      description:
        "Build a plan of study that lets you graduate faster, with better classes, and a lot less headaches.",
    },
  ];

  return (
    <Box
      pt={{ desktop: "6rem", laptop: "6.25rem", tablet: "5rem" }}
      pb={{ desktop: "7.75rem", laptop: "8rem", tablet: "6.5rem" }}
      backgroundColor="primary.blue.light.50"
    >
      <VStack>
        <Heading
          mb={{ desktop: "6rem", laptop: "5rem", tablet: "4rem" }}
          size="2xl"
          color="primary.blue.dark.main"
        >
          How It Works
        </Heading>
        <SimpleGrid columns={3} justifyItems="center" pl="5%" pr="5%">
          {infoSectionData.map((info) => (
            <InfoSection
              key={info.title}
              imageSource={info.imageSource}
              altInfo={info.altInfo}
              title={info.title}
              description={info.description}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

const InfoSection = ({
  imageSource,
  altInfo,
  title,
  description,
}: InfoSectionProps): JSX.Element => {
  return (
    <Flex flexDirection="column" w="55%">
      <InfoImage imageSource={imageSource} altInfo={altInfo} />
      <InfoText title={title} description={description} />
    </Flex>
  );
};

const InfoImage = ({ imageSource, altInfo }: InfoImageProps): JSX.Element => {
  return (
    <Image
      boxSize={{ desktop: "15.5rem", laptop: "12.5rem", tablet: "9.5rem" }}
      pt="5%"
      pb="5%"
      src={imageSource}
      alt={altInfo}
    />
  );
};

const InfoText = ({ title, description }: InfoTextProps): JSX.Element => {
  return (
    <Box>
      <Heading
        pt="10%"
        fontSize={{ desktop: "3xl", laptop: "2xl", tablet: "xl" }}
        color="primary.blue.dark.main"
      >
        {title}
      </Heading>
      <Text pt="3%" color="primary.blue.dark.main" fontWeight="semibold">
        {description}
      </Text>
    </Box>
  );
};

export default LandingPage;
