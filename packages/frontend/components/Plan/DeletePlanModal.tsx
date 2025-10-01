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
import { Dispatch, SetStateAction, useContext } from "react";
import { mutate } from "swr";
import {
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useStudentWithPlans,
} from "../../hooks";
import { handleApiClientError, toast } from "../../utils";
import { IsGuestContext } from "../../pages/_app";

interface DeletePlanModalProps {
  planName: string;
  planId: number;
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
  onPlanDeleted: (deletedPlan: any) => void;
}
export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  planName,
  planId,
  setSelectedPlanId,
  onPlanDeleted,
}) => {
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { isGuest } = useContext(IsGuestContext);
  const { student } = useStudentWithPlans();

  if (!student) {
    return <></>;
  }

  const deletePlan = async () => {
    try {
      const deletedPlan = student.plans.find((plan) => plan.id === planId);
      if (!deletedPlan) return;

      if (isGuest) {
        window.localStorage.setItem(
          "student",
          JSON.stringify({
            ...student,
            plans: student.plans.filter((plan) => plan.id !== planId),
          })
        );
      } else {
        window.localStorage.setItem(
          "lastDeletedPlan",
          JSON.stringify(deletedPlan)
        );
        await API.plans.delete(planId);
      }

      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      setSelectedPlanId(null);
      toast.success(
        "Plan deleted successfully. Press CTRL+Z or Click 'Restore Plan' to undo"
      );

      onPlanDeleted(deletedPlan);
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
          border="1px"
          borderColor="primary.red.main"
          colorScheme="primary.red"
          color="primary.red.main"
          ml="xs"
          borderRadius="lg"
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
                Cancel
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
