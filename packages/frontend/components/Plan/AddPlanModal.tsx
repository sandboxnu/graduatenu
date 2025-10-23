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
  Input,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import {
  CreatePlanDto,
  CreatePlanDtoWithoutSchedule,
  ParsedCourse,
  PlanModel,
  convertToOptionObjects,
} from "@graduate/common";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import {
  useSupportedMajors,
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useStudentWithPlans,
  useSupportedMinors,
  useHasTemplate,
  useTemplate,
  useFetchCourses,
} from "../../hooks";
import {
  cleanDndIdsFromStudent,
  createEmptySchedule,
  extractSupportedMajorOptions,
  extractSupportedMinorOptions,
  extractSupportedMajorYears,
  handleApiClientError,
  noLeadOrTrailWhitespacePattern,
  createScheduleFromTemplate,
  toast,
} from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";
import { HelperToolTip } from "../Help";
import { IsGuestContext, NewPlanModalContext } from "../../pages/_app";
import { GraduateToolTip } from "../GraduateTooltip";
import { getLocalPlansLength } from "../../utils/plan/getLocalPlansLength";
import { useTemplateCourses } from "../../hooks/useTemplateCourses";
import { addTransferCoursesToStudent } from "../../utils/student/addTransferCoursesToStudent.ts";
import { createScheduleFromJson } from "../../utils/plan/createScheduleFromJson";

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
  const { isNewPlanModalOpen, setIsNewPlanModalOpen } =
    useContext(NewPlanModalContext);
  const { supportedMajorsData, error: supportedMajorsError } =
    useSupportedMajors();
  const { supportedMinorsData, error: supportedMinorsError } =
    useSupportedMinors();
  const {
    onOpen: onCreateOpen,
    onClose: onCreateClose,
    isOpen: isCreateOpen,
  } = useDisclosure();
  const {
    onOpen: onImportOpen,
    onClose: onImportClose,
    isOpen: isImportOpen,
  } = useDisclosure();

  // Generate default plan title using formatted date and time
  const generateDefaultPlanTitle = () => {
    const now = new Date();
    return `Plan ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      console.error("Please select a PDF file");
      return;
    }

    try {
      const courses = await API.utils.parsePdfCourses(file);

      setUploadedCourses(courses);
    } catch (error) {
      console.error("Error parsing PDF:", error);
    }
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
  const [isNoMinorSelected, setIsNoMinorSelected] = useState(false);
  const [uploadedCourses, setUploadedCourses] = useState<ParsedCourse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isGuest } = useContext(IsGuestContext);
  const { student } = useStudentWithPlans();
  const [scheduleJson, setScheduleJson] = useState<any>(null); // for importing

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

  // Instead of using useTemplateCourses, use useFetchCourses directly
  const { courses: uploadedCourseDetails } = useFetchCourses(
    uploadedCourses, // We already have the parsed {subject, classId}[] format
    catalogYear || new Date().getFullYear()
  );

  // Create a lookup map for easy access (same as useTemplateCourses does)
  const uploadedCourseLookup =
    uploadedCourseDetails?.reduce((acc, course) => {
      const key = `${course.subject} ${course.classId}`;
      acc[key] = course;
      return acc;
    }, {} as Record<string, any>) || {};

  // Reset useTemplate when major or catalog year changes
  useEffect(() => {
    setValue("useTemplate", false);
  }, [majorName, catalogYear, setValue]);

  // handle keyboard shortcut modal opening
  useEffect(() => {
    if (isNewPlanModalOpen) {
      onOpen();
      setIsNewPlanModalOpen(false);
    }
  }, [isNewPlanModalOpen, onOpen, setIsNewPlanModalOpen]);

  if (!student) {
    return null;
  }

  if (supportedMajorsError) {
    handleApiClientError(supportedMajorsError, router);
    return null; // Ensure we return something when there's an error
  }
  if (supportedMinorsError) {
    handleApiClientError(supportedMinorsError, router);
  }

  const onSubmitHandler = async (
    payload: CreatePlanDtoWithoutSchedule & { useTemplate: boolean }
  ) => {
    // Handle uploaded courses by adding them to student's transfer courses
    if (uploadedCourses.length > 0) {
      try {
        await addTransferCoursesToStudent(
          student,
          uploadedCourses,
          uploadedCourseLookup,
          isGuest
        );
      } catch (error) {
        console.error("Error adding transfer courses:", error);
        return; // Don't proceed with plan creation if transfer courses failed
      }
    }

    // Create normal plan
    let schedule;
    if (payload.useTemplate && template) {
      try {
        schedule = createScheduleFromTemplate(template, courseLookup);
      } catch (error) {
        console.error("Error creating schedule from template:", error);
        schedule = createEmptySchedule();
      }
    } else {
      schedule = createEmptySchedule();
    }

    const newPlan: CreatePlanDto = {
      name: payload.name || generateDefaultPlanTitle(),
      catalogYear: isNoMajorSelected ? undefined : payload.catalogYear,
      major: isNoMajorSelected ? undefined : payload.major,
      minor: isNoMinorSelected ? undefined : payload.minor,
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

      const currentStudentData = JSON.parse(
        window.localStorage.getItem("student") || "{}"
      );

      window.localStorage.setItem(
        "student",
        JSON.stringify({
          ...currentStudentData,
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
    setIsNoMajorSelected(false);
    setIsNoMinorSelected(false);
    setUploadedCourses([]);
    onCloseDisplay();
    onCreateClose();
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

  // Determine if we should disable the Create button
  const isButtonDisabled =
    !isValidForm ||
    // Disable button when template is selected but courses are still loading
    (usingTemplate && isLoadingCourses);

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

  // IMPORT FUNCTIONALITY

  const loadPlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const extractedFile = event.target.files?.[0];
    if (extractedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);
          setScheduleJson(parsed);
          console.log("Parsed schedule JSON:", parsed);
        } catch (err) {
          console.error("Error parsing JSON file:", err);
        }
      };

      reader.readAsText(extractedFile);
    }
  };

  const importFile = async () => {
    if (!scheduleJson || !student) return;

    try {
      const schedule = createScheduleFromJson(scheduleJson);

      const newPlan: CreatePlanDto = {
        name: scheduleJson.name || generateDefaultPlanTitle(),
        catalogYear: scheduleJson["catalogYear"],
        major: scheduleJson["major"],
        concentration: scheduleJson["concentration"],
        schedule,
      };

      let createdPlanId: number;

      if (isGuest) {
        createdPlanId = student.plans.length + 1;

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
        const createdPlan = await API.plans.create(newPlan);
        createdPlanId = createdPlan.id;
      }

      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      onImportClose();
      setSelectedPlanId(createdPlanId);
      toast.success("Plan imported successfully!");
    } catch (error) {
      toast.error("Failed to import plan.");
      console.error("Error importing plan:", error);
    }
  };

  const disableButton = isGuest && getLocalPlansLength() > 4;
  const showCoachMark =
    !selectedPlanId && !isOpen && !isCreateOpen && !isImportOpen;

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
                    <PlanSelect
                      label="Minor"
                      placeholder="Select a Minor"
                      name="minor"
                      control={control}
                      options={extractSupportedMinorOptions(
                        catalogYear,
                        supportedMinorsData
                      )}
                      isDisabled={!catalogYear}
                      isSearchable
                      useFuzzySearch
                    />
                    <Flex align="center">
                      <Text size="xs" mr="xs">
                        Can&apos;t find your major / minor?
                      </Text>
                      <HelperToolTip label="We are working to support all majors, but in the meantime, you can submit feedback requesting your major and select 'No Major' so that you can still use our planner!" />
                    </Flex>

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

                    {!isNoMajorSelected && (
                      <Flex alignItems="center" w="100%" gap="sm">
                        <Text fontWeight="medium">
                          Import from UAchieve PDF:
                        </Text>
                        <Box position="relative">
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                            ref={fileInputRef}
                            position="absolute"
                            opacity="0"
                            width="100%"
                            height="100%"
                            cursor="pointer"
                            zIndex="1"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="primary.blue.light.main"
                            color="primary.blue.dark.main"
                            leftIcon={<AddIcon />}
                            _hover={{
                              bg: "primary.blue.light.faint",
                              borderColor: "primary.blue.dark.main",
                            }}
                          >
                            Choose PDF File
                          </Button>
                        </Box>
                        {uploadedCourses.length > 0 && (
                          <Text color="green.500" fontSize="sm">
                            ✓ {uploadedCourses.length} courses
                          </Text>
                        )}
                      </Flex>
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
                  isLoading={
                    isSubmitting || (usingTemplate && isLoadingCourses)
                  }
                  isDisabled={isButtonDisabled}
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
      <Modal isOpen={isImportOpen} onClose={onImportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Import Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>Upload JSON (.json) file</ModalBody>
          <Input
            placeholder="Upload"
            size="md"
            type="file"
            onChange={loadPlan}
            border="none"
            paddingLeft="24px"
          />
          <ModalFooter justifyContent="center">
            <Flex columnGap="sm">
              <Button
                variant="solid"
                size="md"
                borderRadius="lg"
                type="submit"
                onClick={importFile}
              >
                Import Plan
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
