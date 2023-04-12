import { DeleteIcon } from "@chakra-ui/icons";
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
import { API } from "@graduate/api-client";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { mutate } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { handleApiClientError, toast } from "../../utils";

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
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Delete Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Woah, are you sure you want to delete {planName}?
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Flex columnGap="sm">
              <Button
                variant="solidWhite"
                size="md"
                borderRadius="lg"
                onClick={onClose}
              >
                Nevermind
              </Button>
              <Button
                variant="solid"
                size="md"
                borderRadius="lg"
                type="submit"
                onClick={deletePlan}
              >
                Delete
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
