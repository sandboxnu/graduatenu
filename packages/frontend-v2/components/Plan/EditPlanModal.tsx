import { EditIcon } from "@chakra-ui/icons";
import {
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
  Stack,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { PlanModel, UpdatePlanDto } from "@graduate/common";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import {
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useSupportedMajors,
} from "../../hooks";
import {
  extractSupportedMajorNames,
  extractSupportedMajorYears,
  handleApiClientError,
} from "../../utils";
import { toast } from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";
import { HelperToolTip } from "../Help";
import { PlanConcentrationsSelect } from "./PlanConcentrationsSelect";

type EditPlanModalProps = {
  plan: PlanModel<string>;
};

type EditPlanInput = {
  name: string;
  major: string;
  catalogYear: number;
  concentration: string;
};

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan }) => {
  const { supportedMajorsData, error: supportedMajorsError } =
    useSupportedMajors();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { onOpen, onClose: onCloseDisplay, isOpen } = useDisclosure();
  const [isNoMajorSelected, setIsNoMajorSelected] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<EditPlanInput>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  const resetValuesToCurrPlan = useCallback(() => {
    if (!plan) {
      return;
    }

    // Change the default field to the corresponding plan when a plan is selected/edited
    reset({
      name: plan.name,
      catalogYear: plan.catalogYear,
      major: plan.major,
      concentration: plan.concentration,
    });

    if (!plan.major) {
      setIsNoMajorSelected(true);
    } else {
      setIsNoMajorSelected(false);
    }
  }, [plan, reset, setIsNoMajorSelected]);

  useEffect(() => {
    resetValuesToCurrPlan();
  }, [resetValuesToCurrPlan]);

  if (supportedMajorsError) {
    handleApiClientError(supportedMajorsError, router);
  }

  const catalogYear = watch("catalogYear");
  const majorName = watch("major");

  const onSubmitHandler = async (payload: UpdatePlanDto) => {
    // no submitting till the curr plan has been fetched
    if (!plan) {
      return;
    }

    const isNoMajorSelectedPrev = !plan.major;

    // If no field has been changed, don't send an update request
    if (!isDirty && isNoMajorSelectedPrev === isNoMajorSelected) {
      toast.info("No fields have been updated.");
      return;
    }

    const newPlan: UpdatePlanDto = {
      name: payload.name,
      catalogYear: isNoMajorSelected ? undefined : payload.catalogYear,
      major: isNoMajorSelected ? undefined : payload.major,
      concentration: isNoMajorSelected ? undefined : payload.concentration,
    };

    try {
      await API.plans.update(plan.id, newPlan);
    } catch (error) {
      handleApiClientError(error as Error, router);
      return;
    }

    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    toast.success("Plan updated successfully.");
  };

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

  const onCloseModal = () => {
    resetValuesToCurrPlan();
    onCloseDisplay();
  };

  return (
    <>
      <BlueButton leftIcon={<EditIcon />} onClick={onOpen} ml="xs" size="md">
        Edit Plan
      </BlueButton>

      <Modal isOpen={isOpen} onClose={onCloseModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ModalCloseButton />
            <ModalHeader color="primary.red.main" fontSize="2xl">
              Edit Plan
            </ModalHeader>
            <ModalBody>
              <VStack spacing="sm" alignItems="start">
                <PlanInput
                  error={errors.name}
                  label="Title"
                  type="text"
                  id="name"
                  placeholder="My Plan"
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
                      error={errors.major}
                      array={extractSupportedMajorNames(
                        catalogYear,
                        supportedMajorsData
                      )}
                      {...register("major", {
                        required: "Major is required",
                        onChange: () => {
                          setValue("concentration", "");
                        },
                      })}
                    />
                    <PlanConcentrationsSelect
                      catalogYear={catalogYear}
                      majorName={majorName}
                      supportedMajorsData={supportedMajorsData}
                      register={register}
                      errors={errors}
                    />{" "}
                  </>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button isLoading={isSubmitting} type="submit" ml="auto">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
