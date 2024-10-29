import {
  Box,
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
    <FeaturePage1 />,
    <FeaturePage2 />,
    <FeaturePage3 />,
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

const FeaturePage1: React.FC = () => {
  return (
    <Box>
      <Text>Feature 1</Text>
    </Box>
  );
};

const FeaturePage2: React.FC = () => {
  return (
    <Box>
      <Text>Feature 2</Text>
    </Box>
  );
};

const FeaturePage3: React.FC = () => {
  return (
    <Box>
      <Text>Feature 3</Text>
    </Box>
  );
};
