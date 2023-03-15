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
} from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { API } from "@graduate/api-client";
import { StudentModel } from "@graduate/common";
// import { ChangeEvent, useState } from "react";
import { toast } from "../../utils";

// TODO: change this to actually make it work

interface ChangePasswordProps {
  student: StudentModel<string>;
}
export const ChangePassword: React.FC<ChangePasswordProps> = ({  }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [password, setPassword] = useState<string>(
  //   student.fullName ? student.fullName.split(" ")[0] : ""
  // );
  // const [setLastName] = useState<string>(
  //   student.fullName ? student.fullName.split(" ")[1] : ""
  // );
  const onSubmitHandler = async () => {
    try {
    } catch (error) {
      toast.error("Something went wrong", { log: true });
    }
  };
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
              <FormControl>
                <FormLabel>
                  <Text>Current password</Text>
                </FormLabel>
                <Input
                  // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    // setFirstName(event.target.value)
                  // }
                  type="password"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  <Text>New password</Text>
                </FormLabel>
                <Input
                  // onChange={(event) => {
                    // setLastName(event.target.value);
                  // }}
                  type="password"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {/* TODO: maybe change this to repeat? */}
                  <Text>Confirm new password</Text>
                </FormLabel>
                <Input
                  // onChange={(event) => {
                    // setLastName(event.target.value);
                  // }}
                  type="password"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
              </FormControl>{" "}
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
