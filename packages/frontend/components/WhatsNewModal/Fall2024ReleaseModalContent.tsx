import {
  Box,
  Button,
  HStack,
  Image,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { ModalBodyPagination } from "./ModalBodyPagination";
import InProgressIndicatorImage from "../../public/in-progress-indicator.png";
import SearchNEUIntegrationImage from "../../public/searchneu-integration.png";
import GeneralPlaceholdersImage from "../../public/general-placeholders.png";
import BetaMajorsImage from "../../public/2024-beta-majors.png";
import CoursesAddedToPlanImage from "../../public/courses-added-to-plan-check.png";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";

interface ModalContentProps {
  onClose: () => void;
}

const InProgressIcon: React.FC = () => {
  return (
    <Box
      bg="orange"
      borderColor="orange"
      color="white"
      borderWidth="1px"
      width="18px"
      height="18px"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
      transitionDelay="0.1s"
      borderRadius="2xl"
      p="xs"
      position="relative"
      verticalAlign="middle"
    >
      <Text fontSize="s" boxSize="34px" color="white">
        ...
      </Text>
    </Box>
  );
};

interface FeaturePageData {
  key: string;
  title: string;
  descriptionSection: React.ReactNode;
  image: string;
}

const featurePagesData: FeaturePageData[] = [
  {
    key: "in-progress-indicator",
    title: "In-progress Indicator",
    descriptionSection: (
      <Stack>
        <Text>
          Want to know which major requirements are still in progress?
        </Text>
        <Text>
          Look for the new{""}
          <chakra.span px="1">
            <InProgressIcon />
          </chakra.span>{" "}
          icon to know which requirements are currently in-progress.
        </Text>
      </Stack>
    ),
    image: InProgressIndicatorImage.src,
  },
  {
    key: "courses-added-to-plan-check",
    title: "Courses Added To Plan Check",
    descriptionSection: (
      <Stack>
        <Text>See which courses have been added to your plan at a glance.</Text>
        <Text>
          Now, courses that have been added to your plan will be marked with a
          checkmark in the sidebar!
        </Text>
      </Stack>
    ),
    image: CoursesAddedToPlanImage.src,
  },
  {
    key: "searchneu-integration",
    title: "SearchNEU Integration",
    descriptionSection: (
      <Stack>
        <Text>
          Want to know more about a class before adding it to the plan?
        </Text>
        <Text>
          Click on the new{" "}
          <chakra.span px="1">
            <InfoOutlineIcon />
          </chakra.span>{" "}
          button to read more about a class on SearchNEU.
        </Text>
      </Stack>
    ),
    image: SearchNEUIntegrationImage.src,
  },
  {
    key: "general-placeholders",
    title: "General Placeholder Courses",
    descriptionSection: (
      <Stack>
        <Text>Not fully sure what courses you want to take yet?</Text>
        <Text>
          Add generic elective and NUPath tiles to your schedule to get a sense
          of what your plan would look like.
        </Text>
      </Stack>
    ),
    image: GeneralPlaceholdersImage.src,
  },
  {
    key: "2024-beta-majors",
    title: "Support for 2024-2025 Academic Catalog [BETA]",
    descriptionSection: (
      <Stack>
        <Text>
          We have added support for the undergraduate catalog of the 2024-2025
          academic year.
        </Text>
        <Text>
          You can now create plans that align with the new requirements for the
          2024-2025 academic year.
        </Text>
      </Stack>
    ),
    image: BetaMajorsImage.src,
  },
];

export const Fall2024ReleaseModalContent: React.FC<ModalContentProps> = ({
  onClose,
}) => {
  const [featurePages, setFeaturePages] = React.useState<React.ReactNode[]>([]);

  useEffect(() => {
    const pages = [];
    for (const featurePageData of featurePagesData) {
      pages.push(<NewFeaturePage {...featurePageData} />);
    }
    setFeaturePages(pages);
  }, []);

  return (
    <ModalContent>
      <ModalHeader
        color="primary.blue.dark.main"
        borderBottom="1px"
        borderColor="neutral.200"
      >
        <Text>Latest Release: Fall 2024</Text>
      </ModalHeader>
      {featurePages.length > 0 && <ModalBodyPagination pages={featurePages} />}
      <ModalFooter alignContent="center" justifyContent="center">
        <Button
          variant="solid"
          borderRadius="md"
          width="sm"
          colorScheme="red"
          onClick={onClose}
        >
          Looks Good!
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

const NewFeaturePage: React.FC<FeaturePageData> = ({
  key,
  title,
  descriptionSection,
  image,
}) => {
  return (
    <HStack pt="8" alignItems="start" gap="8" key={key} minHeight={"350px"}>
      <NewFeatureText title={title} descriptionSection={descriptionSection} />
      <NewFeatureImage src={image} alt={title + " image"} />
    </HStack>
  );
};

interface NewFeatureImageProps {
  src: string;
  alt?: string;
}

const NewFeatureImage: React.FC<NewFeatureImageProps> = ({ src, alt }) => {
  return (
    <Stack flex="3">
      <Image
        src={src}
        alt={alt}
        fit={"contain"}
        maxWidth={400}
        maxHeight={300}
        borderRadius="2xl"
      />
    </Stack>
  );
};

interface NewFeatureTextProps {
  title: string;
  descriptionSection: React.ReactNode;
}

const NewFeatureText: React.FC<NewFeatureTextProps> = ({
  title,
  descriptionSection,
}) => {
  return (
    <Stack flex="2">
      <Text fontWeight="bold" fontSize="md" textColor="primary.red.main">
        NEW
      </Text>
      <Text textColor="primary.blue.dark.main" fontWeight="bold" fontSize="xl">
        {title}
      </Text>
      {descriptionSection}
    </Stack>
  );
};
