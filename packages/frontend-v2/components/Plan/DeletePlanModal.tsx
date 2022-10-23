import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  isOpen: boolean;
  onClose: (isDeleted: boolean) => void;
}
export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  planName,
  planId,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const closeWithoutDelete = () => onClose(false);
  const deletePlan = async () => {
    try {
      await API.plans.delete(planId);

      // refresh the cache and close the modal
      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      onClose(true);
    } catch (error) {
      handleApiClientError(error as Error, router);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeWithoutDelete}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Woah, are you sure you want to delete {planName}?</ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={deletePlan}>
            Delete
          </Button>
          <GrayButton onClick={closeWithoutDelete}>Nevermind</GrayButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
