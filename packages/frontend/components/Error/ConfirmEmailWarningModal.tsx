import {
  Modal,
  ModalBody,
  ModalHeader,
  useDisclosure,
  Text,
  ModalFooter,
  Button,
  Link,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { StudentModel } from "@graduate/common";
import { useLocalStorage } from "../../hooks";
import { toast } from "../../utils";

interface ConfirmEmailWarningModalProps {
  student: StudentModel<string>;
}

export const ConfirmEmailWarningModal: React.FC<
  ConfirmEmailWarningModalProps
> = ({ student }) => {
  //TODO: Fix modal show on first time
  const [alreadyVisited, setAlreadyVisited] = useLocalStorage(
    "alreadyVisited",
    false
  );
  // By default, open the modal if the user has not visited this page or if the user is not confirmed
  const { onClose, isOpen } = useDisclosure({
    defaultIsOpen: !student.isEmailConfirmed && !alreadyVisited,
  });

  const closeModal = () => {
    setAlreadyVisited(true);
    onClose();
  };

  const handleResendEmailConfirmation = async () => {
    try {
      await API.email.resendConfirmationLink();
      toast.success("We have sent a confirmation link to your email");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="primary.red.main" fontSize="2xl">
          Your email is not confirmed
        </ModalHeader>
        <ModalBody>
          <Text size="xl">
            If you do not confirm your email, you cannot recover your account if
            you forget your password
          </Text>
          <Link onClick={handleResendEmailConfirmation}>
            Resend the confirmation link to my email
          </Link>
        </ModalBody>
        <ModalFooter>
          <Button type="button" ml="auto" onClick={closeModal}>
            I understand
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
