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
import { InfoOutlineIcon } from "@chakra-ui/icons";

interface ModalContentProps {
  onClose: () => void;
}

export const Fall2024ReleaseModalContent: React.FC<ModalContentProps> = ({
  onClose,
}) => {
  const featurePages: React.ReactNode[] = [
    <InProgressIndicatorFeaturePage />,
    <SearchNEUIntegrationFeaturePage />,
  ];

  return (
    <ModalContent>
      <ModalHeader
        color="primary.blue.dark.main"
        borderBottom="1px"
        borderColor="neutral.200"
      >
        <Text>Latest Release v26.09.24</Text>
      </ModalHeader>
      <ModalBodyPagination pages={featurePages} />
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

const InProgressIndicatorFeaturePage: React.FC = () => {
  return (
    <NewFeaturePage
      title="In-progress Indicator"
      descriptionSection={
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
      }
      image={InProgressIndicatorImage.src}
    />
  );
};

const SearchNEUIntegrationFeaturePage: React.FC = () => {
  return (
    <NewFeaturePage
      title="SearchNEU Integration"
      descriptionSection={
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
      }
      image={SearchNEUIntegrationImage.src}
    />
  );
};

interface NewFeaturePageProps {
  title: string;
  descriptionSection: React.ReactNode;
  image: string;
}

const NewFeaturePage: React.FC<NewFeaturePageProps> = ({
  title,
  descriptionSection,
  image,
}) => {
  return (
    <HStack pt="8" alignItems="start" gap="8">
      <NewFeatureText title={title} descriptionSection={descriptionSection} />
      <Stack flex="3">
        <Image
          src={image}
          alt={title + " image"}
          fit={"contain"}
          maxWidth={400}
          maxHeight={300}
          borderRadius="2xl"
        />
      </Stack>
    </HStack>
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
