import { EditIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import {
  PlanModel,
  UpdatePlanDto,
  convertToOptionObjects,
} from "@graduate/common";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import {
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useStudentWithPlans,
  useSupportedMajors,
  useSupportedMinors,
} from "../../hooks";
import {
  extractSupportedMajorOptions,
  extractSupportedMinorOptions,
  extractSupportedMajorYears,
  handleApiClientError,
  noLeadOrTrailWhitespacePattern,
} from "../../utils";
import { toast } from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";
import { HelperToolTip } from "../Help";
import { IsGuestContext } from "../../pages/_app";

type EditPlanModalProps = {
  plan: PlanModel<string>;
};

type EditPlanInput = {
  name: string;
  majors: string[];
  minors?: string[];
  catalogYear: number;
  concentration: string;
  agreeToBetaMajor: boolean;
};

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan }) => {
  const { supportedMajorsData, error: supportedMajorsError } =
    useSupportedMajors();
  const { supportedMinorsData, error: supportedMinorsError } =
    useSupportedMinors();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { onOpen, onClose: onCloseDisplay, isOpen } = useDisclosure();
  const [isNoMajorSelected, setIsNoMajorSelected] = useState(false);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    watch,
    reset,
    setValue,
    control,
  } = useForm<EditPlanInput>({
    mode: "onTouched",
    shouldFocusError: true,
  });
  const { student } = useStudentWithPlans();
  const { isGuest } = useContext(IsGuestContext);

  const resetValuesToCurrPlan = useCallback(() => {
    if (!plan) {
      return;
    }

    // Change the default field to the corresponding plan when a plan is selected/edited
    reset({
      name: plan.name,
      catalogYear: plan.catalogYear,
      majors: plan.majors,
      minors: plan.minors,
      concentration: plan.concentration,
    });

    if (!plan.majors) {
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
  if (supportedMinorsError) {
    handleApiClientError(supportedMinorsError, router);
  }

  if (!student) {
    return <></>;
  }

  const title = watch("name");
  const catalogYear = watch("catalogYear");
  const majors = watch("majors");
  const minors = watch("minors");
  const concentration = watch("concentration");
  const agreeToBetaMajor = watch("agreeToBetaMajor");

  const yearSupportedMajors =
    supportedMajorsData?.supportedMajors[catalogYear ?? 0];

  const noConcentrations = { concentrations: [], minRequiredConcentrations: 0 };

  const majorConcentrations =
    yearSupportedMajors?.[majors?.[0] ?? ""] ?? noConcentrations;

  const isConcentrationRequired =
    majorConcentrations.minRequiredConcentrations > 0;

  const majorHasConcentrations = majorConcentrations.concentrations.length > 0;

  const isValidatedMajor =
    yearSupportedMajors?.[majors?.[0] ?? ""]?.verified ?? false;

  const isValidForm =
    (title &&
      catalogYear &&
      majors &&
      (!isConcentrationRequired || concentration) &&
      (!isValidatedMajor ? agreeToBetaMajor : true)) ||
    // Valid plan for no major selected
    (title && isNoMajorSelected);

  const onSubmitHandler = async (payload: UpdatePlanDto) => {
    // no submitting till the curr plan has been fetched
    if (!plan) {
      return;
    }

    const isNoMajorSelectedPrev = !plan.majors;

    // If no field has been changed, don't send an update request
    if (!isDirty && isNoMajorSelectedPrev === isNoMajorSelected) {
      toast.info("No fields have been updated.");
      return;
    }

    const newPlan: UpdatePlanDto = {
      name: payload.name,
      catalogYear: isNoMajorSelected ? undefined : payload.catalogYear,
      majors: isNoMajorSelected ? undefined : payload.majors,
      concentration: isNoMajorSelected ? undefined : payload.concentration,
      minors: payload.minors,
    };

    if (isGuest) {
      const newTempPlan = {
        ...plan,
        ...newPlan,
      };

      window.localStorage.setItem(
        "student",
        JSON.stringify({
          ...student,
          plans: student.plans.map((cur) =>
            cur.id === plan.id ? newTempPlan : cur
          ),
        })
      );
    } else {
      try {
        await API.plans.update(plan.id, newPlan);
      } catch (error) {
        handleApiClientError(error as Error, router);
        return;
      }
    }

    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    toast.success("Plan updated successfully.");
    onCloseModal();
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
    setShowAdvancedEdit(false);
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
            <ModalHeader color="primary.blue.dark.main" textAlign="center">
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
                    pattern: noLeadOrTrailWhitespacePattern,
                  })}
                />
                <Flex alignItems="center">
                  <Checkbox
                    mb="0"
                    mr="xs"
                    borderColor="primary.blue.dark.main"
                    isChecked={isNoMajorSelected}
                    onChange={() => setIsNoMajorSelected(!isNoMajorSelected)}
                  />
                  <Text
                    color="primary.blue.dark.main"
                    size="md"
                    fontWeight="medium"
                    mb="0"
                    mr="2xs"
                  >
                    No Major
                  </Text>
                  <HelperToolTip label={noMajorHelperLabel} />
                </Flex>
                {!isNoMajorSelected && (
                  <>
                    <PlanSelect
                      label="Catalog Year"
                      placeholder="Select a Catalog Year"
                      name="catalogYear"
                      control={control}
                      options={convertToOptionObjects(
                        extractSupportedMajorYears(supportedMajorsData)
                      )}
                      onChangeSideEffect={(val: string | string[] | null) => {
                        const stringVal = Array.isArray(val) ? val[0] : val;
                        const newYear = stringVal
                          ? parseInt(stringVal, 10)
                          : null;
                        if (newYear !== catalogYear) {
                          if (
                            stringVal &&
                            supportedMajorsData?.supportedMajors?.[stringVal]?.[
                              majors[0]
                            ]
                          ) {
                            // we can keep the major, but we should check the concentration
                            if (
                              !supportedMajorsData?.supportedMajors?.[
                                stringVal
                              ]?.[majors[0]]?.concentrations?.includes(
                                concentration
                              )
                            ) {
                              setValue("concentration", "");
                            }
                          } else {
                            setValue("majors", []);
                          }
                        }
                      }}
                      rules={{ required: "Catalog year is required." }}
                      isNumeric
                    />
                    {majors?.map((major, index) => (
                      <Box key={index} w="100%">
                        <PlanSelect
                          label={index === 0 ? "Major(s)" : undefined}
                          placeholder="Select a Major"
                          name={`majors.${index}`}
                          isMulti={false}
                          control={control}
                          options={extractSupportedMajorOptions(
                            catalogYear,
                            supportedMajorsData
                          )}
                          onChangeSideEffect={() => {
                            setValue("concentration", "");
                          }}
                          rules={
                            index === 0
                              ? { required: "Major is required." }
                              : {}
                          }
                          isSearchable
                          useFuzzySearch
                          isDisabled={!catalogYear}
                          removeButton={
                            index > 0 ? (
                              <CloseButton
                                position="absolute"
                                top="-5px"
                                right="-5px"
                                cursor="pointer"
                                color="white"
                                bg="red.400"
                                boxSize="16px"
                                fontSize="8px"
                                _hover={{ color: "red.700" }}
                                onClick={() => {
                                  const newMajors = majors.filter(
                                    (_, i) => i !== index
                                  );
                                  setValue("majors", newMajors);
                                  setValue("concentration", "");
                                }}
                              />
                            ) : undefined
                          }
                        />
                      </Box>
                    ))}
                    <Text
                      cursor="pointer"
                      textColor="blue.500"
                      fontWeight="medium"
                      onClick={() => setValue("majors", [...majors, ""])}
                    >
                      + Add a Major
                    </Text>
                    {majorHasConcentrations && (
                      <PlanSelect
                        label="Concentrations"
                        name="concentration"
                        placeholder="Select a Concentration"
                        options={convertToOptionObjects(
                          majorConcentrations.concentrations,
                          true
                        )}
                        control={control}
                        rules={{
                          required:
                            isConcentrationRequired &&
                            "Concentration is required",
                        }}
                        isSearchable
                        useFuzzySearch
                      />
                    )}

                    <Box w="100%">
                      <hr />
                      <Flex justify="flex-end" w="100%" mb="sm">
                        <Text
                          cursor="pointer"
                          color="primary"
                          fontWeight="medium"
                          fontSize="sm"
                          onClick={() => setShowAdvancedEdit(!showAdvancedEdit)}
                          display="flex"
                          alignItems="center"
                        >
                          Advanced edit
                          <ChevronDownIcon
                            ml="1"
                            transform={
                              showAdvancedEdit
                                ? "rotate(180deg)"
                                : "rotate(0deg)"
                            }
                            transition="transform 0.2s"
                          />
                        </Text>
                      </Flex>

                      {showAdvancedEdit && (
                        <VStack padding="5" bg="gray.100" alignItems="start">
                          {minors?.map((minor, index) => (
                            <Box key={index} w="100%">
                              <PlanSelect
                                label={index === 0 ? "Minor(s)" : undefined}
                                placeholder="Select a Minor"
                                name={`minors.${index}`}
                                isMulti={false}
                                control={control}
                                options={extractSupportedMinorOptions(
                                  catalogYear,
                                  supportedMinorsData
                                )}
                                isDisabled={!catalogYear}
                                isSearchable
                                useFuzzySearch
                                removeButton={
                                  index > 0 ? (
                                    <CloseButton
                                      position="absolute"
                                      top="-5px"
                                      right="-5px"
                                      cursor="pointer"
                                      color="white"
                                      bg="red.400"
                                      boxSize="16px"
                                      fontSize="8px"
                                      _hover={{ color: "red.700" }}
                                      onClick={() => {
                                        const newMinors = minors.filter(
                                          (_, i) => i !== index
                                        );
                                        setValue("minors", newMinors);
                                        setValue("concentration", "");
                                      }}
                                    />
                                  ) : undefined
                                }
                              />
                            </Box>
                          ))}
                          <Text
                            cursor="pointer"
                            textColor="blue.500"
                            fontWeight="medium"
                            onClick={() => {
                              const currentMinors = minors || [];
                              setValue("minors", [...currentMinors, ""]);
                            }}
                          >
                            + Add a Minor
                          </Text>
                        </VStack>
                      )}
                    </Box>

                    {majors && !isValidatedMajor && (
                      <Flex alignItems="center">
                        <Checkbox
                          mr="md"
                          {...register("agreeToBetaMajor", {
                            required: "You must agree to continue",
                          })}
                        />
                        <Text>
                          I understand that I am selecting a beta major and that
                          the requirements may not be accurate.
                        </Text>
                      </Flex>
                    )}
                  </>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
              <Flex columnGap="sm">
                <Button
                  variant="solidWhite"
                  size="md"
                  borderRadius="lg"
                  onClick={onCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  isLoading={isSubmitting}
                  isDisabled={!isValidForm}
                  size="md"
                  borderRadius="lg"
                  type="submit"
                >
                  Save
                </Button>
              </Flex>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
