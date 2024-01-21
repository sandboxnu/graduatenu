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
import { GraduateToolTip } from "../GraduateTooltip";

interface DeleteYearModalProps {
  yearNum: number;
  removeYear: Dispatch<SetStateAction<number | undefined | null>>;
}
export const DeleteYearModal: React.FC<DeleteYearModalProps> = ({
  yearNum,
  removeYear,
}) => {
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { isGuest } = useContext(IsGuestContext);
  const { student } = useStudentWithPlans();

  if (!student) {
    return <></>;
  }

  const deleteYear = async () => {
    try {
      // refresh the cache, show success message, and close the modal
      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      //   setSelectedPlanId(null);
      removeYear(yearNum);
      toast.success("Year deleted successfully.");
      onClose();
    } catch (error) {
      handleApiClientError(error as Error, router);
    }
  };

  return (
    <>
      <GraduateToolTip label={`Delete Year ${yearNum}?`} fontSize="md">
        <IconButton
          aria-label="Delete course"
          variant="ghost"
          color="white"
          icon={<DeleteIcon />}
          marginLeft="auto"
          marginRight="sm"
          _hover={{ bg: "white", color: "primary.red.main" }}
          _active={{ bg: "primary.blue.light.900" }}
          onClick={onOpen}
        />
      </GraduateToolTip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Delete Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Woah, are you sure you want to delete Year {yearNum}?
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
                onClick={deleteYear}
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
