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

// TODO: change this to actually make it work

export const ChangePassword: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = useState<string | undefined>();
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [confirmNewPassword, setConfirmNewPassword] = useState<
    string | undefined
  >();
  const onSubmitHandler = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        toast.error("Please make sure all fields are filled out!");
      } else if (newPassword !== confirmNewPassword) {
        toast.error(
          "Please make sure you've entered your new password correctly"
        );
      } else {
        await API.auth.changePassword({
          oldPassword,
          newPassword,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", { log: true });
    }
  };

  const confirmPasswordError =
    newPassword !== confirmNewPassword && newPassword !== "";
  const oldPasswordError = oldPassword === "";
  return (
    <>
      <Text onClick={onOpen}>Change password</Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text textAlign="center" fontWeight="bold">
              Change Password
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex rowGap="lg" direction="column">
              <FormControl isInvalid={oldPasswordError}>
                <FormLabel>
                  <Text>Current password</Text>
                </FormLabel>
                <Input
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setOldPassword(event.target.value)
                  }
                  value={oldPassword}
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
                onClick={onClose}
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
