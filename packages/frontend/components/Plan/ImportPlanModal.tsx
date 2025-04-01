import { DownloadIcon } from "@chakra-ui/icons";
import { Box, Input, Icon } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

export const ImportPlanModal: React.FC = ({}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);

  const loadPlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const extractedFile = event.target.files?.[0];
    if (extractedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          setFile(json);
          console.log("Parsed JSON:", json);
        } catch (err) {
          console.error("Error parsing JSON file:", err);
        }
      };

      reader.readAsText(extractedFile);
    }
  };

  const importFile = () => {
    if (file) {
    }
  };

  return (
    <>
      <Tooltip label={`Import`} fontSize="md">
        <IconButton
          icon={<DownloadIcon />}
          style={{ transform: "rotate(180deg)" }}
          aria-label="Export plan"
          variant="outline"
          border="1px"
          borderColor="#32CD32"
          colorScheme="#32CD32"
          color="#32CD32"
          ml="xs"
          borderRadius="lg"
          onClick={onOpen}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Import Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>Upload a plan file:</ModalBody>
          <Input
            placeholder="Upload"
            size="md"
            type="file"
            onChange={loadPlan}
            border="none"
          />
          <ModalFooter justifyContent="center">
            <Flex columnGap="sm">
              <Button
                variant="solidWhite"
                size="md"
                borderRadius="lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="md"
                borderRadius="lg"
                type="submit"
                onClick={importFile}
                backgroundColor="#32CD32"
              >
                Import
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
