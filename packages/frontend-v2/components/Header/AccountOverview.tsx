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
import { toast } from "../../utils";
import { KeyedMutator } from "swr";
import { useForm } from "react-hook-form";
import { GraduateInput } from "../Form";

interface AccountOverviewProps {
  student: StudentModel<string>;
  mutateStudent: KeyedMutator<StudentModel<string>>;
}

interface UpdateName {
  firstName: string;
  lastName: string;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({
  student,
  mutateStudent,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<UpdateName>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  const firstName = watch("firstName", "");

  const onSubmitHandler = async (payload: UpdateName) => {
    try {
      const newStudent: StudentModel<string> = {
        ...student,
        fullName: `${payload.firstName} ${payload.lastName}`,
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
        <ModalContent as="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <ModalHeader>
            <Text textAlign="center" fontWeight="bold">
              Account Overview
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex rowGap="lg" direction="column">
              <Flex columnGap="md">
                <GraduateInput
                  type="text"
                  formLabel="First Name"
                  id="firstName"
                  placeholder="Cooper"
                  {...register("firstName", {
                    onBlur: () => trigger("lastName"),
                  })}
                />
                <GraduateInput
                  error={errors.lastName}
                  type="text"
                  formLabel="Last Name"
                  id="lastName"
                  placeholder="The Dog"
                  {...register("lastName", {
                    validate: (lastName) => {
                      if (lastName !== "" && firstName === "") {
                        return "Please enter your first name along with your last name.";
                      }
                      return true;
                    },
                  })}
                />
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
                isLoading={isSubmitting}
                isDisabled={Object.keys(errors).length > 0}
                size="md"
                borderRadius="lg"
                type='submit'
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
