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
import { API } from "@graduate/api-client";
import { StudentModel } from "@graduate/common";
import { useState } from "react";
import { toast } from "../../utils";
import { KeyedMutator } from "swr";

interface AccountOverviewProps {
  student: StudentModel<string>;
  mutateStudent: KeyedMutator<StudentModel<string>>;
}
export const AccountOverview: React.FC<AccountOverviewProps> = ({
  student,
  mutateStudent,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [firstName, setFirstName] = useState<string>(
    student.fullName ? student.fullName.split(" ")[0] : ""
  );
  const [lastName, setLastName] = useState<string>(
    student.fullName ? student.fullName.split(" ")[1] : ""
  );
  const onSubmitHandler = async () => {
    try {
      const newStudent: StudentModel<string> = {
        ...student,
        fullName: `${firstName} ${lastName}`,
      };
      mutateStudent(async () => {
        await API.student.update(newStudent);
        return newStudent;
      });
      toast.success("Info successfully updated!");
      onClose();
    } catch (error) {
      toast.error("Something went wrong", { log: true });
    }
  };
  return (
    <>
      <Text onClick={onOpen}>Account Overview</Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text textAlign="center" fontWeight="bold">
              Account Overview
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex rowGap="lg" direction="column">
              <Flex columnGap="md">
                <FormControl>
                  <FormLabel>
                    <Text>First Name</Text>
                  </FormLabel>
                  <Input
                    onChange={(event) => setFirstName(event.target.value)}
                    value={firstName}
                    placeholder="Paws"
                    type="text"
                    size="md"
                    variant="outline"
                    borderColor="neutral.main"
                    borderWidth="2px"
                    borderRadius="md"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    <Text>Last Name</Text>
                  </FormLabel>
                  <Input
                    onChange={(event) => {
                      setLastName(event.target.value);
                    }}
                    value={lastName}
                    placeholder="Husky"
                    type="text"
                    size="md"
                    variant="outline"
                    borderColor="neutral.main"
                    borderWidth="2px"
                    borderRadius="md"
                  />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>
                  <Text>Email</Text>
                </FormLabel>
                <Input
                  value={student.email}
                  disabled={true}
                  type="email"
                  size="md"
                  variant="outline"
                  borderColor="neutral.main"
                  borderWidth="2px"
                  borderRadius="md"
                />
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
