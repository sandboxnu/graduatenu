import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

interface WhatsNewPopUpProps {
  // is model open or not?
  isOpen: boolean;
  // Closes the modal
  onClose: () => void;
}

export const WhatsNewPopUp: React.FC<WhatsNewPopUpProps> = ({
  isOpen,
  onClose,
}) => {
  const [pageNum, setPageNum] = useState(1);
  const nextPage = () => setPageNum((prev) => prev + 1);
  const prevPage = () => setPageNum((prev) => prev - 1);
  const renderPage = () => {
    switch (pageNum) {
      case 1:
        return (
          <>
            <Text color="tomato" as="b">
              NEW PAGE 1
            </Text>
            <Text>these are the new features</Text>
          </>
        );
      case 2:
        return (
          <>
            <Text color="tomato" as="b">
              NEW PAGE 2
            </Text>
            <Text>these are the new features</Text>
          </>
        );
      case 3:
        return (
          <>
            <Text color="tomato" as="b">
              NEW PAGE 3
            </Text>
            <Text>these are the new features</Text>
          </>
        );
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color="primary.blue.dark.main"
          borderBottom="1px"
          borderColor="neutral.200"
        >
          <Text>Latest Release v26.09.24</Text>
        </ModalHeader>
        <ModalBody>{renderPage()}</ModalBody>
        <ModalFooter justifyContent="space-between">
          {pageNum > 1 && (
            <Button variant="outline" onClick={prevPage}>
              Previous
            </Button>
          )}
          {pageNum < 3 ? (
            <Button colorScheme="blue" onClick={nextPage}>
              Next
            </Button>
          ) : (
            <Button colorScheme="red" onClick={onClose}>
              Looks Good!
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
