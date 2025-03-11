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
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import {
  CreatePlanDto,
  CreatePlanDtoWithoutSchedule,
  PlanModel,
  convertToOptionObjects,
} from "@graduate/common";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import {
  useSupportedMajors,
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useStudentWithPlans,
  useHasTemplate,
  useTemplate,
} from "../../hooks";
import {
  cleanDndIdsFromStudent,
  createEmptySchedule,
  extractSupportedMajorOptions,
  extractSupportedMajorYears,
  handleApiClientError,
  noLeadOrTrailWhitespacePattern,
  createScheduleFromTemplate,
} from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";
import { HelperToolTip } from "../Help";
import { IsGuestContext } from "../../pages/_app";
import { GraduateToolTip } from "../GraduateTooltip";
import { getLocalPlansLength } from "../../utils/plan/getLocalPlansLength";
import { useTemplateCourses } from "../../hooks/useTemplateCourses";

interface AddPlanModalProps {
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
  selectedPlanId: number | undefined | null;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({
  setSelectedPlanId,
  selectedPlanId,
}) => {
  const router = useRouter();
  const { onOpen, onClose: onCloseDisplay, isOpen } = useDisclosure();
  const { supportedMajorsData, error: supportedMajorsError } =
    useSupportedMajors();

  // Generate default plan title using formatted date and time
  const generateDefaultPlanTitle = () => {
    const now = new Date();
    return `Plan ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
    control,
  } = useForm<CreatePlanDtoWithoutSchedule & { useTemplate: boolean }>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  const [isNoMajorSelected, setIsNoMajorSelected] = useState(false);
  const { isGuest } = useContext(IsGuestContext);
  const { student } = useStudentWithPlans();

  // watch form fields
  const catalogYear = watch("catalogYear");
  const majorName = watch("major");
  const concentration = watch("concentration");
  const agreeToBetaMajor = watch("agreeToBetaMajor");
  const usingTemplate = watch("useTemplate");

  // Check if the selected major has a template
  const { hasTemplate } = useHasTemplate(majorName, catalogYear);
  const { template } = useTemplate(
    usingTemplate ? majorName : null,
    usingTemplate ? catalogYear : null
  );

  // Fetch actual course data for the template
  const { courseLookup, isLoading: isLoadingCourses } = useTemplateCourses(
    usingTemplate ? template : null,
    usingTemplate
      ? typeof catalogYear === "number"
        ? catalogYear
        : null
      : null
  );

  // Reset useTemplate when major or catalog year changes
  useEffect(() => {
    setValue("useTemplate", false);
  }, [majorName, catalogYear, setValue]);

  if (!student) {
    return null;
  }

  if (supportedMajorsError) {
    handleApiClientError(supportedMajorsError, router);
    return null; // Ensure we return something when there's an error
  }

  const onSubmitHandler = async (
    payload: CreatePlanDtoWithoutSchedule & { useTemplate: boolean }
  ) => {
    // Determine which schedule to use - template or empty
    let schedule;

    if (payload.useTemplate && template) {
      try {
        // Use the template to create a schedule with pre-populated courses
        schedule = createScheduleFromTemplate(template, courseLookup);
      } catch (error) {
        console.error("Error creating schedule from template:", error);
        schedule = createEmptySchedule();
      }
    } else {
      // Default to empty schedule
      schedule = createEmptySchedule();
    }

    const newPlan: CreatePlanDto = {
      name: payload.name || generateDefaultPlanTitle(),
      catalogYear: isNoMajorSelected ? undefined : payload.catalogYear,
      major: isNoMajorSelected ? undefined : payload.major,
      concentration: isNoMajorSelected ? undefined : payload.concentration,
      schedule,
    };

    // create the new plan
    let createdPlanId: number;
    if (isGuest) {
      createdPlanId = student.plans.length + 1;
      // Create plan in local storage
      const planInLocalStorage: PlanModel<null> = {
        ...newPlan,
        id: createdPlanId,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: cleanDndIdsFromStudent(student),
      } as PlanModel<null>;

      window.localStorage.setItem(
        "student",
        JSON.stringify({
          ...student,
          plans: [...student.plans, planInLocalStorage],
        })
      );
    } else {
      try {
        const createdPlan = await API.plans.create(newPlan);
        createdPlanId = createdPlan.id;
      } catch (error) {
        handleApiClientError(error as Error, router);

        // don't proceed further if POST failed
        return;
      }
    }

    // refresh the cache and close the modal
    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    onCloseAddPlanModal();
    setSelectedPlanId(createdPlanId);
  };
  const onCloseAddPlanModal = () => {
    reset();
    onCloseDisplay();
    setIsNoMajorSelected(false);
  };
  const yearSupportedMajors =
    supportedMajorsData?.supportedMajors[catalogYear ?? 0];

  const noConcentrations = { concentrations: [], minRequiredConcentrations: 0 };

  const majorConcentrations =
    yearSupportedMajors?.[majorName ?? ""] ?? noConcentrations;

  const isConcentrationRequired =
    majorConcentrations.minRequiredConcentrations > 0;

  const majorHasConcentrations = majorConcentrations.concentrations.length > 0;

  const isValidatedMajor =
    yearSupportedMajors?.[majorName ?? ""]?.verified ?? false;

  const isValidForm =
    (catalogYear &&
      majorName &&
      (!isConcentrationRequired || concentration) &&
      (!isValidatedMajor ? agreeToBetaMajor : true)) ||
    // Valid plan for no major selected
    isNoMajorSelected;

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

  const templateHelperLabel = (
    <Stack>
      <Text>
        This major has a recommended template plan of study available.
      </Text>
      <Text>
        Selecting this option will pre-populate your plan with the recommended
        courses.
      </Text>
      {usingTemplate && isLoadingCourses && (
        <Text color="blue.500">Loading course details...</Text>
      )}
    </Stack>
  );

  const disableButton = isGuest && getLocalPlansLength() > 4;
  const showCoachMark = !selectedPlanId && !isOpen;

  return (
    <>
      <GraduateToolTip
        label="Maximum number of plans reached on guest mode. Delete an existing plan or create an account."
        shouldWrapChildren
        isDisabled={!disableButton}
      >
        <Tooltip
          shouldWrapChildren
          label="Click here to start!"
          hasArrow
          fontSize="md"
          borderRadius="sm"
          shadow="lg"
          isDisabled
          isOpen={showCoachMark}
        >
          <BlueButton
            leftIcon={<AddIcon />}
            onClick={onOpen}
            ml="xs"
            size="md"
            disabled={disableButton}
          >
            New Plan
          </BlueButton>
        </Tooltip>
      </GraduateToolTip>
      <Modal isOpen={isOpen} onClose={() => onCloseAddPlanModal()} size="md">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ModalCloseButton />
            <ModalHeader color="primary.blue.dark.main" textAlign="center">
              New Plan
            </ModalHeader>
            <ModalBody>
              <VStack spacing="sm" alignItems="start">
                <PlanInput
                  label="Title"
                  id="name"
                  type="text"
                  placeholder={generateDefaultPlanTitle()}
                  error={errors.name}
                  {...register("name", {
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
                      onChangeSideEffect={(val: string | null) => {
                        const newYear = val ? parseInt(val, 10) : null;
                        if (newYear !== catalogYear) {
                          if (
                            val &&
                            majorName &&
                            supportedMajorsData?.supportedMajors?.[val]?.[
                              majorName
                            ]
                          ) {
                            // we can keep the major, but we should check the concentration
                            if (
                              majorName &&
                              !supportedMajorsData?.supportedMajors?.[val]?.[
                                majorName
                              ]?.concentrations?.includes(concentration ?? "")
                            ) {
                              setValue("concentration", "");
                            }
                          } else {
                            setValue("major", "");
                          }
                        }
                      }}
                      rules={{ required: "Catalog year is required." }}
                      isNumeric
                    />
                    <PlanSelect
                      label="Major"
                      placeholder="Select a Major"
                      name="major"
                      control={control}
                      options={extractSupportedMajorOptions(
                        catalogYear,
                        supportedMajorsData
                      )}
                      onChangeSideEffect={() => {
                        setValue("concentration", "");
                      }}
                      rules={{ required: "Major is required." }}
                      isDisabled={!catalogYear}
                      isSearchable
                      useFuzzySearch
                    />
                    <Flex align="center">
                      <Text size="xs" mr="xs">
                        Can&apos;t find your major?
                      </Text>
                      <HelperToolTip label="We are working to support all majors, but in the meantime, you can submit feedback requesting your major and select 'No Major' so that you can still use our planner!" />
                    </Flex>
                    {majorHasConcentrations && (
                      <PlanSelect
                        label="Concentrations"
                        name="concentration"
                        placeholder="Select a Concentration"
                        options={convertToOptionObjects(
                          majorConcentrations.concentrations
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

                    {/* Template option - show when a template is available */}
                    {hasTemplate && majorName && catalogYear && (
                      <Box
                        p="sm"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="primary.blue.light.main"
                        bg="primary.blue.light.faint"
                        w="100%"
                      >
                        <Flex alignItems="center">
                          <Checkbox
                            mb="0"
                            mr="xs"
                            borderColor="primary.blue.dark.main"
                            {...register("useTemplate")}
                          />
                          <Text
                            color="primary.blue.dark.main"
                            size="md"
                            fontWeight="medium"
                            mb="0"
                            mr="2xs"
                          >
                            Use recommended template
                          </Text>
                          <HelperToolTip label={templateHelperLabel} />
                        </Flex>
                        <Text fontSize="sm" color="gray.600" ml="6" mt="1">
                          This will pre-populate your plan with the recommended
                          course sequence
                        </Text>
                      </Box>
                    )}

                    {majorName && !isValidatedMajor && (
                      <Flex alignItems="center">
                        <Checkbox
                          mr="md"
                          borderColor="primary.blue.dark.main"
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
                  onClick={onCloseAddPlanModal}
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
                  Create Plan
                </Button>
              </Flex>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
