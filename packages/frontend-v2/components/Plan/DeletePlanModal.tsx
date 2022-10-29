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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { mutate } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { handleApiClientError, toast } from "../../utils";
import { GrayButton } from "../Button";

interface DeletePlanModalProps {
  planName: string;
  planId: number;
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
}
export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  planName,
  planId,
  setSelectedPlanId,
}) => {
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const deletePlan = async () => {
    try {
      await API.plans.delete(planId);

      // refresh the cache, show success message, and close the modal
      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      setSelectedPlanId(null);
      toast.success("Plan deleted successfully.");
      onClose();
    } catch (error) {
      handleApiClientError(error as Error, router);
    }
  };

  return (
    <>
      <Tooltip label={`Delete ${planName}?`} fontSize="md">
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
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
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
            <GrayButton onClick={onClose}>Nevermind</GrayButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
