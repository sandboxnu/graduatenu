import type { NextPage } from "next";
import {
  Box,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Link,
  useMediaQuery,
} from "@chakra-ui/react";
import { GraduateButtonLink, GraduatePreAuthHeader } from "../components";
import {
  AlmostGivingDayModalContent,
  GivingDayModal,
} from "../components/GivingDay/GivingDayModal";

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
  const [isMobile] = useMediaQuery("(max-width: 640px)");

  return (
    <Box>
      <GraduatePreAuthHeader />
      <GivingDayModal>
        <AlmostGivingDayModalContent />
        {/** Swap out on April 10th */}
        {/* <GivingDayModalContent /> */}
      </GivingDayModal>
      <Banner />
      <Info />
      {isMobile && <WhyDesktop />}
      {!isMobile && <GetStarted />}
      <Footer />
    </Box>
  );
};

const Banner = (): JSX.Element => {
  return (
    <Box
      pt={{ desktop: "5rem", laptop: "3rem", tablet: "2.5rem", base: "0" }}
      pb={{ desktop: "11rem", laptop: "9rem", tablet: "6.25rem" }}
    >
      <Flex
        direction={{ tablet: "row", base: "column" }}
        justifyContent="center"
        alignItems="center"
        mt={{ tablet: "0", base: "130px" }}
      >
        <Image
          boxSize={{
            desktop: "34.25rem",
            laptop: "31.25rem",
            tablet: "25rem",
            base: "14rem",
          }}
          mx={{ desktop: "6.25rem", laptop: "5rem", base: "0" }}
          src="/husky.svg"
          alt="husky"
        />
        <Flex
          w={{ tablet: "35%", base: "100%" }}
          flexDirection="column"
          alignItems="start"
        >
          <Box
            w={{ tablet: "100%", base: "85%" }}
            textAlign={{ tablet: "left", base: "center" }}
            pt={{ desktop: "0", laptop: "0", base: "1rem" }}
            mx="auto"
          >
            <Heading
              fontSize={{
                desktop: "7xl",
                laptop: "6xl",
                tablet: "5xl",
                base: "4xl",
              }}
              color="primary.red.main"
              fontWeight="normal"
              lineHeight="1"
              mb={{ tablet: "-12px", base: "-6px" }}
            >
              Graduate
            </Heading>
            <Heading
              fontSize={{
                desktop: "8xl",
                laptop: "7xl",
                tablet: "6xl",
                base: "5xl",
              }}
              color="primary.blue.dark.main"
              fontWeight="bold"
              lineHeight="1"
            >
              Your Way
            </Heading>
            <Text
              maxW="550px"
              w={{ tablet: "90%", base: "100%" }}
              mt={{ tablet: "2xl", base: "lg" }}
              mb={{ tablet: "0", base: "2xl" }}
              fontSize={{
                desktop: "2xl",
                laptop: "2xl",
                tablet: "xl",
                base: "xl",
              }}
              color="primary.blue.dark.main"
              lineHeight="1.3"
            >
              Navigate the Northeastern graduation requirements and create a
              personalized plan of study.
            </Text>
          </Box>
          <Box display={{ tablet: "inline", base: "none" }}>
            <GraduateButtonLink
              href="/signup"
              mr={{ desktop: "7.5rem", laptop: "6.25rem", tablet: "3.25rem" }}
              mt="2xl"
              variant="solid"
              borderRadius="lg"
              px="3xl"
              py="lg"
            >
              Get Started
            </GraduateButtonLink>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

const Info = (): JSX.Element => {
  const infoSectionData = [
    {
      imageSource: "/landing_start.png",
      altInfo: "Start",
      title: "Start",
      description:
        "Select a major and concentration to get started with a multi-year plan.",
    },
    {
      imageSource: "/landing_personalize.svg",
      altInfo: "Personalize",
      title: "Personalize",
      description:
        "Create multiple plans to experiment with different majors, concentrations, and plans of study. Pick the classes you want. We'll take care of NUPath, prerequisites, and everything in between.",
    },
    {
      imageSource: "/landing_graduate.svg",
      altInfo: "Graduate",
      title: "Graduate",
      description:
        "Build a plan of study that lets you graduate faster, take better classes, and prevent headaches.",
    },
  ];

  return (
    <Box
      pt={{ desktop: "6rem", laptop: "6.25rem", tablet: "5rem" }}
      pb={{ desktop: "7.75rem", laptop: "8rem", tablet: "6.5rem" }}
      backgroundColor="#F5F6F8"
    >
      <VStack py={{ tablet: "0", base: "2xl" }} maxW="1280px" mx="auto">
        <Heading
          mb={{ desktop: "6rem", laptop: "5rem", tablet: "4rem" }}
          size="2xl"
          color="primary.blue.dark.main"
        >
          How It Works
        </Heading>
        <SimpleGrid
          columns={{ tablet: 3, base: 1 }}
          justifyItems="center"
          pl="5%"
          pr="5%"
        >
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
    <Flex flexDirection="column" w={{ tablet: "65%", base: "85%" }}>
      <InfoImage imageSource={imageSource} altInfo={altInfo} />
      <InfoText title={title} description={description} />
    </Flex>
  );
};

const InfoImage = ({ imageSource, altInfo }: InfoImageProps): JSX.Element => {
  return (
    <Image
      boxSize={{
        desktop: "15.5rem",
        laptop: "12.5rem",
        tablet: "9.5rem",
        base: "15.5rem",
      }}
      mx="auto"
      mt={{ tablet: "0", base: "5%" }}
      py="5%"
      src={imageSource}
      alt={altInfo}
      objectFit="contain"
    />
  );
};

const InfoText = ({ title, description }: InfoTextProps): JSX.Element => {
  return (
    <Box>
      <Heading
        pt="10%"
        fontSize={{ desktop: "3xl", laptop: "2xl", tablet: "xl", base: "2xl" }}
        color="primary.blue.dark.main"
        textAlign="center"
        mt={{ tablet: "0", base: "-1rem" }}
      >
        {title}
      </Heading>
      <Text
        fontSize={{ tablet: "md", base: "xl" }}
        pt="3%"
        textAlign="center"
        mb={{ tablet: "0", base: "3rem" }}
      >
        {description}
      </Text>
    </Box>
  );
};

const WhyDesktop = (): JSX.Element => {
  return (
    <VStack
      bg="primary.blue.dark.main"
      py="15%"
      px="5%"
      spacing="2rem"
      color="white"
      textAlign="center"
    >
      <Heading fontSize="2xl">Why are we only on desktop?</Heading>
      <Text fontSize="xl">
        We strive to provide our users with the best user experience possible,
        and as such we are focusing our efforts on the desktop experience. We
        are doing our best to finalize this experience before providing our
        mobile users with a great experience as well!
      </Text>
      <Image
        pt="lg"
        src="/home_simplified.svg"
        alt="Home Page"
        objectFit="contain"
      />
    </VStack>
  );
};

const GetStarted = (): JSX.Element => {
  return (
    <VStack py="6rem">
      <Heading mb="3rem" size="2xl" color="primary.blue.dark.main">
        Ready To Get Started?
      </Heading>

      <GraduateButtonLink
        href="/signup"
        variant="solid"
        borderRadius="lg"
        px="3xl"
        py="lg"
      >
        Sign Up
      </GraduateButtonLink>
    </VStack>
  );
};

const Footer = (): JSX.Element => {
  return (
    <Flex h="4rem" alignItems="center" justifyContent="center">
      <Text fontSize="sm" fontWeight="semibold" color="primary.blue.dark.main">
        Made by students @{" "}
        <Link
          textDecoration="underline"
          href="https://sandboxnu.com"
          target="_blank"
        >
          Sandbox
        </Link>
      </Text>
    </Flex>
  );
};

export default LandingPage;
