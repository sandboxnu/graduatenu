import {
  Badge,
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Textarea,
  VStack,
  TextareaProps,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import {
  MajorValidationError,
  MajorValidationResult,
  PlanModel,
  ScheduleCourse2,
} from "@graduate/common";
import { memo, PropsWithChildren, useEffect, useRef, useState } from "react";
import { DraggableScheduleCourse } from "../ScheduleCourse";
import SidebarSection from "./SidebarSection";
import {
  getAllCoursesFromPlan,
  getSectionError,
  getAllCoursesInMajor,
  BETA_MAJOR_TOOLTIP_MSG,
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
import { useFetchCourses, useMajor } from "../../hooks";
import { HelperToolTip } from "../Help";
import NUPathSection from "./NUPathSection";
import DropdownWarning from "./DropdownWarning";
import { NUPathEnum } from "@graduate/common";
import { forwardRef } from "react";

import ResizeTextarea from "react-textarea-autosize";

export enum SidebarValidationStatus {
  Loading = "Loading",
  Error = "Error",
  Complete = "Complete",
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
      error,
    } = useMajor(selectedPlan.catalogYear, selectedPlan.major);
    const concentration = major?.concentrations?.concentrationOptions.find(
      (concentration) => concentration.title === selectedPlan.concentration
    );

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
    useEffect(() => revalidateMajor(), [selectedPlan, major]);

    const majorCourses = getAllCoursesInMajor(major, concentration);

    const {
      courses,
      isLoading: isCoursesLoading,
      error: courseErrors,
    } = useFetchCourses(majorCourses, selectedPlan.catalogYear);

    const courseData = createCourseMap(courses, courseErrors);

    if (isMajorLoading) {
      return <SidebarContainer title="Loading..." />;
    }

    if (!major) {
      if (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return <SidebarContainer title="Major not found" />;
        }

        handleApiClientError(error, router);
      }

      return <SidebarContainer title="" />;
    }

    const concentrationValidationError: MajorValidationError | undefined =
      getSectionError(major.requirementSections.length, validationStatus);

    let concentrationValidationStatus = SidebarValidationStatus.Complete;
    if (validationStatus === undefined) {
      concentrationValidationStatus = SidebarValidationStatus.Loading;
    } else if (concentrationValidationError) {
      concentrationValidationStatus = SidebarValidationStatus.Error;
    }

    const creditsTaken = totalCreditsInSchedule(
      selectedPlan.schedule,
      transferCourses
    );

    return (
      <SidebarContainer
        title={major.name}
        subtitle={selectedPlan.concentration}
        creditsTaken={creditsTaken}
        creditsToTake={major.totalCreditsRequired}
        renderCoopBlock
        renderBetaMajorBlock={major.metadata?.verified !== true}
        planId={selectedPlan.id}
      >
        {courseData && (
          <>
            <NUPathSection
              coursesTaken={coursesTaken}
              dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-nupath`}
              loading={isCoursesLoading}
            />
            {major.requirementSections.map((section, index) => {
              const sectionValidationError: MajorValidationError | undefined =
                getSectionError(index, validationStatus);

              let sectionValidationStatus = SidebarValidationStatus.Complete;
              if (validationStatus === undefined) {
                sectionValidationStatus = SidebarValidationStatus.Loading;
              } else if (sectionValidationError) {
                sectionValidationStatus = SidebarValidationStatus.Error;
              }

              return (
                <SidebarSection
                  key={section.title}
                  section={section}
                  validationStatus={sectionValidationStatus}
                  courseData={courseData}
                  dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-${index}`}
                  loading={isCoursesLoading}
                />
              );
            })}
            {concentration && (
              <SidebarSection
                validationStatus={concentrationValidationStatus}
                section={concentration}
                courseData={courseData}
                dndIdPrefix={`${SIDEBAR_DND_ID_PREFIX}-concentration`}
              />
            )}
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
      <Stack px="md">
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

// Still a bit buggy
const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <Textarea
        minH="unset"
        w="100%"
        ref={ref}
        minRows={4}
        as={ResizeTextarea}
        maxRows={10}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";

interface SidebarContainerProps {
  title: string;
  subtitle?: string;
  creditsTaken?: number;
  creditsToTake?: number;
  renderCoopBlock?: boolean;
  renderBetaMajorBlock?: boolean;
  renderDropdownWarning?: boolean;
  planId: string | number;
}

export const NoPlanSidebar: React.FC = () => {
  return <SidebarContainer title="No Plan Selected" />;
};

const SidebarContainer: React.FC<PropsWithChildren<SidebarContainerProps>> = ({
  title,
  subtitle,
  creditsTaken,
  creditsToTake,
  renderCoopBlock,
  renderBetaMajorBlock,
  renderDropdownWarning = true,
  planId,
  children,
}) => {
  const [notes, setNotes] = useState<string>("");
  const handleNewNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    // have a notes object plan_id (number | string) -> note (string)
    localStorage.setItem(planId.toString(), e.target.value);
    console.log("New notes: ", e.target.value);
  };

  useEffect(() => {
    if (!planId) return;

    const storedNotes = localStorage.getItem(planId.toString());
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, [planId]);

  return (
    <Box pt="xl" borderRight="1px" borderRightColor="neutral.200" minH="100%">
      <Box px="md" pb="md">
        <Box pb="sm">
          {renderBetaMajorBlock && (
            <Flex alignItems="center" pb="sm">
              <Badge
                borderColor="red"
                borderWidth="1px"
                variant="outline"
                colorScheme="red"
                fontWeight="bold"
                fontSize="sm"
                borderRadius="md"
                mr="sm"
              >
                BETA MAJOR
              </Badge>
              <HelperToolTip label={BETA_MAJOR_TOOLTIP_MSG} />
            </Flex>
          )}
          <Flex alignItems="center" columnGap="2xs">
            <Heading
              as="h1"
              fontSize="2xl"
              color="primary.blue.dark.main"
              fontWeight="bold"
            >
              {title}
            </Heading>
          </Flex>
          {subtitle && (
            <Text fontSize="sm" color="primary.blue.dark.main">
              {subtitle}
            </Text>
          )}
        </Box>
        {renderDropdownWarning && <DropdownWarning />}
        {creditsTaken !== undefined && (
          <Flex mb="sm" alignItems="baseline" columnGap="xs">
            <Text
              fontSize="2xl"
              color="primary.blue.dark.main"
              fontWeight="bold"
            >
              {creditsTaken}
              {creditsToTake !== undefined && `/${creditsToTake}`}
            </Text>
            <Text color="primary.blue.dark.main">Credits Completed</Text>
          </Flex>
        )}
        {renderCoopBlock && (
          <DraggableScheduleCourse
            scheduleCourse={COOP_BLOCK}
            isDisabled={false}
          />
        )}
      </Box>

      {children}

      <Box backgroundColor="white" pt="6" pb="6" px="3">
        <VStack align="left" px="4">
          <Flex mb="3">
            <Image src="/sandbox_logo.svg" alt="sandbox logo" mr="2" />
            <Text
              color="primary.blue.dark.main"
              fontSize="sm"
              fontWeight="bold"
            >
              Sandbox Area {planId}
            </Text>
          </Flex>
          <Text color="primary.blue.dark.main" fontSize="sm" fontWeight="bold">
            Notes
          </Text>
          <AutoResizeTextarea
            placeholder="notes here!"
            resize="vertical"
            height="initial"
            value={notes}
            onChange={handleNewNotes}
          />
        </VStack>
      </Box>
    </Box>
  );
};

// We need to manually set the display name like this because
// of how we're using memo above.
Sidebar.displayName = "Sidebar";

export { Sidebar };
