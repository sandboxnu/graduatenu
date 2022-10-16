import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { handleApiClientError } from "../../utils";
import { GrayButton } from "../Button";

interface DeletePlanModalProps {
  planName: string;
  planId: number;
  onClose: (isDeleted: boolean, closeDisplay: () => void) => void;
}
export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  planName,
  planId,
  onClose,
}) => {
  const router = useRouter();
  const { onOpen, onClose: closeDisplay, isOpen } = useDisclosure();

  const closeWithoutDelete = () => {
    onClose(false, closeDisplay);
  };
  const deletePlan = async () => {
    try {
      await API.plans.delete(planId);

      // refresh the cache and close the modal
      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      onClose(true, closeDisplay);
    } catch (error) {
      handleApiClientError(error as Error, router);
    }
  };

  return (
    <>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete plan"
        variant="outline"
        borderColor="primary.blue.light.main"
        colorScheme="primary.blue.light"
        color="primary.blue.light.main"
        ml="xs"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={closeWithoutDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Woah, are you sure you want to delete {planName}?
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={deletePlan}>
              Delete
            </Button>
            <GrayButton onClick={closeWithoutDelete}>Nevermind</GrayButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
