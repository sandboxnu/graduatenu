import { Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import {
  MajorValidationError,
  MajorValidationResult,
  PlanModel,
  ScheduleCourse2,
} from "@graduate/common";
import { memo, useEffect, useRef, useState } from "react";
import SidebarSection from "./SidebarSection";
import {
  getAllCoursesFromPlan,
  getSectionError,
  getAllCoursesInMajor,
  getAllCoursesInMinor,
  UNDECIDED_CONCENTRATION,
  UNDECIDED_STRING,
} from "../../utils";
import {
  handleApiClientError,
  SIDEBAR_DND_ID_PREFIX,
  totalCreditsInSchedule,
} from "../../utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import {
  WorkerMessage,
  WorkerMessageType,
  WorkerPostInfo,
} from "../../validation-worker/worker-messages";
import { useFetchCourses, useMajor, useMinor } from "../../hooks";
import NUPathSection from "./NUPathSection";
import { NUPathEnum } from "@graduate/common";
import GenericSection from "./GenericSection";
import SidebarContainer from "./SidebarContainer";

export enum SidebarValidationStatus {
  Loading = "Loading",
  Error = "Error",
  Complete = "Complete",
  InProgress = "InProgress",
}

export const COOP_BLOCK: ScheduleCourse2<string> = {
  name: "Co-op Education",
  classId: "Experiential Learning",
  subject: "",
  numCreditsMax: 8,
  numCreditsMin: 0,
  id: `${SIDEBAR_DND_ID_PREFIX}-co-op-block"`,
  nupaths: [NUPathEnum.EX],
};

const createCourseMap = (
  courses: ScheduleCourse2<null>[] | undefined,
  courseErrors: Error | AxiosError | undefined
) => {
  const courseData: { [id: string]: ScheduleCourse2<null> } = {};
  if (courses && !courseErrors) {
    for (const course of courses) {
      if (course) {
        courseData[`${course.subject}${course.classId}`] = course;
      }
    }
  }

  return courseData;
};

// A number to help avoid displaying stale validation info.
let currentRequestNum = 0;

interface SidebarProps {
  selectedPlan: PlanModel<string>;
  transferCourses: ScheduleCourse2<unknown>[];
}

const Sidebar: React.FC<SidebarProps> = memo(
  ({ selectedPlan, transferCourses }) => {
    const router = useRouter();
    const {
      major,
      isLoading: isMajorLoading,
      error: majorError,
    } = useMajor(selectedPlan.catalogYear, selectedPlan.major);
    const concentration = major?.concentrations?.concentrationOptions.find(
      (concentration) => concentration.title === selectedPlan.concentration
    );

    const {
      minor,
      isLoading: isMinorLoading,
      error: minorError,
    } = useMinor(selectedPlan.catalogYear, selectedPlan.minor ?? "");

    const workerRef = useRef<Worker>();

    const [validationStatus, setValidationStatus] = useState<
      MajorValidationResult | undefined
    >(undefined);

    const coursesTaken = [
      ...getAllCoursesFromPlan(selectedPlan),
      ...transferCourses,
    ];

    const revalidateMajor = () => {
      setValidationStatus(undefined);
      if (!selectedPlan || !major || !workerRef.current) return;

      currentRequestNum += 1;
      const validationInfo: WorkerPostInfo = {
        major: major,
        minor: minor,
        taken: coursesTaken,
        concentration: selectedPlan.concentration,
        requestNumber: currentRequestNum,
      };

      workerRef.current?.postMessage(validationInfo);
    };

    // Set up the web worker to handle major validation for us. This helps keep the
    // UI thread free to display our app, preventing UI freezes while our schedule
    // is being validated.
    useEffect(() => {
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL("../../validation-worker/worker.ts", import.meta.url)
        );
        workerRef.current.onmessage = (
          message: MessageEvent<WorkerMessage>
        ) => {
          switch (message.data.type) {
            case WorkerMessageType.Loaded:
              revalidateMajor();
              break;
            case WorkerMessageType.ValidationResult:
              // Only update valdation information if it was from the latest request.
              // This helps us avoid displaying outdated information that could be sent
              // due to race conditions.
              if (message.data.requestNumber === currentRequestNum) {
                setValidationStatus(message.data.result);
              }

              break;
            default:
              throw new Error("Invalid worker message!");
          }
        };
      }
      return () => {
        workerRef.current?.terminate();
        workerRef.current = undefined;
      };
      // LINT NOTE: We don't actually want a dependency to the local function
      // revalidateMajor because it will change every time, so we're choosing
      // to omit it here:
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Whenever our plan/major changes, we revalidate if the worker
    // is initialized.
    // LINT NOTE: We don't actually want a dependency to the local function
    // revalidateMajor because it will change every time, so we're choosing
    // to omit it here:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => revalidateMajor(), [selectedPlan, major, minor]);

    const majorCourses = getAllCoursesInMajor(major, concentration);
    const minorCourses = getAllCoursesInMinor(minor);

    const {
      courses,
      isLoading: isCoursesLoading,
      error: courseErrors,
    } = useFetchCourses(
      majorCourses.concat(minorCourses),
      selectedPlan.catalogYear
    );

    const courseData = createCourseMap(courses, courseErrors);

    if (isMajorLoading || isMinorLoading) {
      return <SidebarContainer title="Loading..." />;
    }

    if (!major) {
      if (majorError) {
        if (
          axios.isAxiosError(majorError) &&
          majorError.response?.status === 404
        ) {
          return <SidebarContainer title="Major not found" />;
        }

        handleApiClientError(majorError, router);
      }

      return <SidebarContainer title="" />;
    }

    if (selectedPlan.minor && !minor) {
      if (minorError) {
        handleApiClientError(minorError, router);
      }
    }

    const getSidebarValidationStatus = (
      validationError: MajorValidationError | undefined
    ): SidebarValidationStatus => {
      if (validationStatus === undefined) {
        return SidebarValidationStatus.Loading;
      } else if (
        validationError &&
        validationError.type === "SECTION" &&
        validationError.maxPossibleChildCount === 0
      ) {
        return SidebarValidationStatus.Error;
      } else if (
        validationError &&
        validationError.type === "SECTION" &&
        validationError.maxPossibleChildCount > 0
      ) {
        return SidebarValidationStatus.InProgress;
      }
      return SidebarValidationStatus.Complete;
    };

    const concentrationValidationError: MajorValidationError | undefined =
      getSectionError(
        (major ? 1 : 0) + (minor ? 1 : 0), // offset by major and minor length
        0, // the concentration AND index is always 0
        validationStatus
      );

    let concentrationValidationStatus = SidebarValidationStatus.Complete;

    if (validationStatus === undefined) {
      concentrationValidationStatus = SidebarValidationStatus.Loading;
    } else if (
      concentrationValidationError &&
      concentrationValidationError.type === "SECTION" &&
      concentrationValidationError.maxPossibleChildCount === 0
    ) {
      concentrationValidationStatus = SidebarValidationStatus.Error;
    } else if (
      concentrationValidationError &&
      concentrationValidationError.type === "SECTION" &&
      concentrationValidationError.maxPossibleChildCount > 0
    ) {
      concentrationValidationStatus = SidebarValidationStatus.InProgress;
    }

    const creditsTaken = totalCreditsInSchedule(
      selectedPlan.schedule,
      transferCourses
    );

    return (
      <SidebarContainer
        title={major.name}
        subtitle={
          selectedPlan.concentration === UNDECIDED_STRING
            ? UNDECIDED_CONCENTRATION
            : selectedPlan.concentration
        }
        creditsTaken={creditsTaken}
        creditsToTake={major.totalCreditsRequired}
        renderCoopBlock
        renderBetaMajorBlock={major.metadata?.verified !== true}
        planId={selectedPlan.id}
      >
        {courseData && (
          <>
            <GenericSection
              courseData={courseData}
              dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-generic`}
              loading={isCoursesLoading}
            />
            <NUPathSection
              coursesTaken={coursesTaken}
              dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-nupath`}
              loading={isCoursesLoading}
            />
            <Tabs
              size="md"
              variant="enclosed-colored"
              colorScheme="blue"
              pt={3}
              backgroundColor="neutral.50"
            >
              <TabList
                display="flex"
                gap={2}
                borderBottom="2px solid"
                borderColor="neutral.200"
              >
                <Tab
                  _selected={{ color: "white", bg: "blue.800" }}
                  flex="0.4"
                  ml={4}
                  p={1}
                  borderTopRadius="lg"
                  fontWeight="bold"
                >
                  MAJOR
                </Tab>
                {minor && (
                  <Tab
                    _selected={{ color: "white", bg: "blue.800" }}
                    flex="0.4"
                    p={1}
                    borderTopRadius="lg"
                    fontWeight="bold"
                  >
                    MINOR
                  </Tab>
                )}
              </TabList>
              <TabPanels>
                <TabPanel width="100%" p={0} m={0}>
                  {major.requirementSections.map((section, index) => {
                    const sectionValidationError:
                      | MajorValidationError
                      | undefined = getSectionError(
                      0, // AND index for the current major requirement
                      index, // Section index, aligning with the array structure
                      validationStatus
                    );

                    const sectionValidationStatus = getSidebarValidationStatus(
                      sectionValidationError
                    );
                    return (
                      <SidebarSection
                        key={section.title}
                        section={section}
                        validationStatus={sectionValidationStatus}
                        courseData={courseData}
                        dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-${index}`}
                        loading={isCoursesLoading}
                        coursesTaken={coursesTaken}
                      />
                    );
                  })}

                  {concentration && (
                    <SidebarSection
                      validationStatus={concentrationValidationStatus}
                      section={concentration}
                      courseData={courseData}
                      dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-concentration`}
                      loading={isCoursesLoading}
                      coursesTaken={coursesTaken}
                    />
                  )}
                </TabPanel>
                <TabPanel width="100%" p={0} m={0}>
                  {minor && (
                    <>
                      <Flex>
                        <Heading
                          color="primary.blue.dark.main"
                          fontSize="md"
                          py={4}
                          px={4}
                        >
                          Minor Requirements
                        </Heading>
                      </Flex>
                      {minor.requirementSections.map((section, index) => {
                        const sectionValidationError:
                          | MajorValidationError
                          | undefined = getSectionError(
                          1, // Offset by major length
                          index, // Section index for minor
                          validationStatus
                        );

                        const sectionValidationStatus =
                          getSidebarValidationStatus(sectionValidationError);
                        return (
                          <SidebarSection
                            key={index}
                            section={section}
                            courseData={courseData}
                            dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-minor`}
                            validationStatus={sectionValidationStatus}
                            loading={isCoursesLoading}
                            coursesTaken={coursesTaken}
                          ></SidebarSection>
                        );
                      })}
                    </>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </SidebarContainer>
    );
  }
);

interface NoMajorSidebarProps {
  selectedPlan: PlanModel<string>;
  transferCourses: ScheduleCourse2<unknown>[];
}

export const NoMajorSidebar: React.FC<NoMajorSidebarProps> = ({
  selectedPlan,
  transferCourses,
}) => {
  const creditsTaken = totalCreditsInSchedule(
    selectedPlan.schedule,
    transferCourses
  );
  return (
    <SidebarContainer
      title="No Major"
      creditsTaken={creditsTaken}
      renderCoopBlock
      renderDropdownWarning={false}
      planId={selectedPlan.id}
    >
      <Stack px="md" mb="3">
        <Text>
          A major has not been selected for this plan. Please select one if you
          would like to see major requirements. If we do not support your major,
          you can{" "}
          <Link
            fontWeight="bold"
            color="primary.blue.light.main"
            href="https://forms.gle/o5AHSuFSwDJREEPp7"
            isExternal
          >
            request it here
          </Link>
          .
        </Text>
        <Text>
          Use the “Add Course” button in the schedule to add a course to a
          semester.
        </Text>
      </Stack>
    </SidebarContainer>
  );
};

export const NoPlanSidebar: React.FC = () => {
  return <SidebarContainer title="No Plan Selected" />;
};

// We need to manually set the display name like this because
// of how we're using memo above.
Sidebar.displayName = "Sidebar";

export { Sidebar };
