import React from "react";
import {
  Modal,
  ModalOverlay,
  Stack,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react";

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      {children}
    </Modal>
  );
};

export interface WhatsNewModalContentProps {
  onClose: () => void;
}

export interface NewFeatureTextProps {
  title: string;
  descriptionSection: React.ReactNode;
}

export const NewFeatureText: React.FC<NewFeatureTextProps> = ({
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

export interface NewFeatureImageProps {
  src: string;
  alt?: string;
}

export const NewFeatureImage: React.FC<NewFeatureImageProps> = ({
  src,
  alt,
}) => {
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
export interface FeaturePageData {
  key: string;
  title: string;
  descriptionSection: React.ReactNode;
  image: string;
}

export const NewFeaturePage: React.FC<FeaturePageData> = ({
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
