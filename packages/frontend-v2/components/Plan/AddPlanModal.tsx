import { AddIcon } from "@chakra-ui/icons";
import {
  Text,
  Stack,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { CreatePlanDto, CreatePlanDtoWithoutSchedule } from "@graduate/common";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import {
  useSupportedMajors,
  USE_STUDENT_WITH_PLANS_SWR_KEY,
} from "../../hooks";
import {
  createEmptySchedule,
  extractSupportedMajorNames,
  extractSupportedMajorYears,
  handleApiClientError,
} from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";
import { HelperToolTip } from "../Help";
import { PlanConcentrationsSelect } from "./PlanConcentrationsSelect";

interface AddPlanModalProps {
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({
  setSelectedPlanId,
}) => {
  const router = useRouter();
  const { onOpen, onClose: onCloseDisplay, isOpen } = useDisclosure();
  const { supportedMajorsData, error: supportedMajorsError } =
    useSupportedMajors();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<CreatePlanDtoWithoutSchedule>({
    mode: "onTouched",
    shouldFocusError: true,
  });
  const [isNoMajorSelected, setIsNoMajorSelected] = useState(false);

  if (supportedMajorsError) {
    handleApiClientError(supportedMajorsError, router);
  }

  const onSubmitHandler = async (payload: CreatePlanDtoWithoutSchedule) => {
    const schedule = createEmptySchedule();
    const newPlan: CreatePlanDto = {
      name: payload.name,
      catalogYear: isNoMajorSelected ? undefined : payload.catalogYear,
      major: isNoMajorSelected ? undefined : payload.major,
      concentration: isNoMajorSelected ? undefined : payload.concentration,
      schedule,
    };

    // create the new plan
    let createdPlanId: number;
    try {
      const createdPlan = await API.plans.create(newPlan);
      createdPlanId = createdPlan.id;
    } catch (error) {
      handleApiClientError(error as Error, router);

      // don't proceed further if POST failed
      return;
    }

    // refresh the cache and close the modal
    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    onCloseAddPlanModal();
    setSelectedPlanId(createdPlanId);
  };

  const onCloseAddPlanModal = () => {
    reset();
    setIsNoMajorSelected(false);
    onCloseDisplay();
  };

  const catalogYear = watch("catalogYear");
  const majorName = watch("major");

  const noMajorHelperLabel = (
    <Stack>
      <Text>
        You can opt out of selecting a major for this plan if you are unsure or
        if we do not support your major.
      </Text>
      <Text>
        Without a selected major, we won&apos;t be able to display the major
        requirements.
      </Text>
    </Stack>
  );

  return (
    <>
      <BlueButton leftIcon={<AddIcon />} onClick={onOpen} ml="xs" size="md">
        Add Plan
      </BlueButton>
      <Modal isOpen={isOpen} onClose={() => onCloseAddPlanModal()} size="md">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ModalCloseButton />
            <ModalHeader color="primary.red.main" fontSize="2xl">
              New Plan
            </ModalHeader>
            <ModalBody>
              <VStack spacing="sm" alignItems="start">
                <PlanInput
                  label="Title"
                  id="name"
                  type="text"
                  placeholder="My Plan"
                  error={errors.name}
                  {...register("name", {
                    required: "Title is required",
                  })}
                />
                <Flex alignItems="center">
                  <Text
                    color="primary.red.main"
                    size="md"
                    fontWeight="medium"
                    mb="0"
                    mr="2xs"
                  >
                    No Major
                  </Text>
                  <Checkbox
                    mb="0"
                    mr="xs"
                    borderColor="primary.blue.dark.main"
                    isChecked={isNoMajorSelected}
                    onChange={() => setIsNoMajorSelected(!isNoMajorSelected)}
                  />
                  <HelperToolTip label={noMajorHelperLabel} />
                </Flex>
                {!isNoMajorSelected && (
                  <>
                    <PlanSelect
                      label="Catalog Year"
                      id="catalogYear"
                      placeholder="Select a Catalog Year"
                      error={errors.catalogYear}
                      array={extractSupportedMajorYears(supportedMajorsData)}
                      {...register("catalogYear", {
                        required: "Catalog year is required",
                        valueAsNumber: true,
                      })}
                    />

                    <PlanSelect
                      label="Major"
                      id="major"
                      placeholder="Select a Major"
                      helperText='First select your catalog year. If you still cannot find your major, select "No Major" above.'
                      error={errors.major}
                      array={extractSupportedMajorNames(
                        catalogYear,
                        supportedMajorsData
                      )}
                      {...register("major", {
                        required: "Major is required",
                      })}
                    />
                    <PlanConcentrationsSelect
                      catalogYear={catalogYear}
                      majorName={majorName}
                      supportedMajorsData={supportedMajorsData}
                      register={register}
                      errors={errors}
                    />
                  </>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button isLoading={isSubmitting} type="submit" ml="auto">
                Add Plan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
