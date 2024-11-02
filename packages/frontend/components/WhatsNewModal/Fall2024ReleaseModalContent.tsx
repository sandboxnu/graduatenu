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
} from "@chakra-ui/react";
import { ModalBodyPagination } from "./ModalBodyPagination";

interface ModalContentProps {
  onClose: () => void;
}

export const Fall2024ReleaseModalContent: React.FC<ModalContentProps> = ({
  onClose,
}) => {
  const featurePages: React.ReactNode[] = [
    <WhatsNewModalFeaturePage />,
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

const WhatsNewModalFeaturePage: React.FC = () => {
  return (
    <NewFeaturePage
      title="What's New Modal"
      descriptionSection={
        <Text>Stay up to date with the latest changes on GraduateNU!</Text>
      }
      image="https://placehold.co/600x400"
    />
  );
};

const InProgressIndicatorFeaturePage: React.FC = () => {
  return (
    <NewFeaturePage
      title="In-progress Indicator"
      descriptionSection={
        <Text>
          Have your degree audit move with you and see what requirement sections
          are currently in progress!
        </Text>
      }
      image="https://placehold.co/600x400"
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
            Want to know more about a class before adding it to the plan?{" "}
          </Text>
          <Text>
            Click on the new <span>i</span> button to read more about a class on
            SearchNEU
          </Text>
        </Stack>
      }
      image="https://placehold.co/600x400"
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
        <Image src={image} borderRadius="2xl" />
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
