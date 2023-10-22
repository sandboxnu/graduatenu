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
import { noLeadOrTrailWhitespacePattern, toast } from "../../utils";
import { KeyedMutator } from "swr";
import { useForm } from "react-hook-form";
import { GraduateInput } from "../Form";
import { useEffect } from "react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { ResendEmailVerificationLink } from "../Authentication";
import { GraduateToolTip } from "../GraduateTooltip";

interface AccountOverviewProps {
  student: StudentModel<string>;
  mutateStudent: KeyedMutator<StudentModel<string>>;
}

interface UpdateName {
  fullName: string;
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
    reset,
  } = useForm<UpdateName>({
    mode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (student.fullName) {
      reset({
        fullName: student.fullName,
      });
    }
  }, [reset, student]);

  const onSubmitHandler = async (payload: UpdateName) => {
    try {
      const newStudent: StudentModel<string> = {
        ...student,
        fullName: payload.fullName,
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
            <Text
              textAlign="center"
              fontWeight="bold"
              color="primary.blue.dark.main"
            >
              Account Overview
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex rowGap="lg" direction="column">
              <Flex columnGap="md">
                <GraduateInput
                  type="text"
                  formLabel="Full Name"
                  id="fullName"
                  placeholder="Cooper The Dog"
                  error={errors.fullName}
                  {...register("fullName", {
                    pattern: noLeadOrTrailWhitespacePattern,
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
                {!student.isEmailConfirmed && (
                  <Flex alignItems="center" mt="xs" columnGap="xs">
                    <GraduateToolTip
                      placement="top"
                      label="Your email is not verified yet. If you do not verify your
              email, you cannot recover your account if you forget your
              password."
                    >
                      <WarningTwoIcon color="states.warning.main" />
                    </GraduateToolTip>
                    <ResendEmailVerificationLink label="Send Verification Email" />
                  </Flex>
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
                isLoading={isSubmitting}
                isDisabled={Object.keys(errors).length > 0}
                size="md"
                borderRadius="lg"
                type="submit"
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
