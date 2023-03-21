import { ChangeEvent, useState } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Flex,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { toast } from "../../utils";
import axios from "axios";

export const ChangePassword: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const closeModal = () => {
    onClose()
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const onSubmitHandler = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        toast.error("Please make sure all fields are filled out!");
      } else if (newPassword !== confirmNewPassword) {
        toast.error(
          "Please make sure you've entered your new password correctly"
        );
      } else {
        await API.student.changePassword({
          oldPassword,
          newPassword,
        });
        toast.success("Password has been changed!");
        closeModal()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `${error.response?.data.message}. Please check your inputs and try again.`
        );
      } else {
        toast.error("Something went wrong", { log: true });
      }
    }
  };

  const confirmPasswordError =
    newPassword !== confirmNewPassword && newPassword !== "";
  const oldPasswordError = oldPassword === "";
  return (
    <>
      <Text onClick={onOpen}>Change password</Text>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text textAlign="center" fontWeight="bold">
              Change Password
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex rowGap="lg" direction="column" as="form">
              <FormControl isInvalid={oldPasswordError}>
                <FormLabel>
                  <Text>Current password</Text>
                </FormLabel>
                <Input
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setOldPassword(event.target.value)
                  }
                  value={oldPassword}
                  id="oldPassword"
                  type="password"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
                {oldPasswordError && (
                  <FormErrorMessage>Old password required!</FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>
                  <Text>New password</Text>
                </FormLabel>
                <Input
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                  }}
                  value={newPassword}
                  id="newPassword"
                  type="password"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
              </FormControl>
              <FormControl isInvalid={confirmPasswordError}>
                <FormLabel>
                  <Text>Confirm new password</Text>
                </FormLabel>
                <Input
                  onChange={(event) => {
                    setConfirmNewPassword(event.target.value);
                  }}
                  value={confirmNewPassword}
                  id="confirmNewPassword"
                  type="password"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
                {confirmPasswordError && (
                  <FormErrorMessage>
                    <Text>Your passwords must match!</Text>
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Flex columnGap="sm">
              <Button
                variant="solidWhite"
                size="md"
                borderRadius="lg"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="md"
                borderRadius="lg"
                onClick={onSubmitHandler}
              >
                Save
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
