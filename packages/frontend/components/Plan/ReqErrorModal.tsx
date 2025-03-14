import { AddIcon, WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  assertUnreachable,
  INEUReqCourseError,
  INEUReqError,
  ScheduleCourse2,
  ScheduleTerm2,
  SeasonEnum,
} from "@graduate/common";
import { HelperToolTip } from "../Help";
import {
  COOP_TITLE,
  FALL_1,
  FALL_1_COOP_ERROR_MSG,
  GENERIC_ERROR_MSG,
  SEARCH_NEU_FETCH_COURSE_ERROR_MSG,
  SPRING_4_COOP_ERROR_MSG,
  addClassesToTerm,
  cleanDndIdsFromPlan,
  getCourseDisplayString,
  handleApiClientError,
  updatePlanForStudent,
} from "../../utils";
import {
  fetchStudentAndPrepareForDnd,
  useFetchCourse,
  useStudentWithPlans,
} from "../../hooks";
import { GraduateToolTip } from "../GraduateTooltip";
import { SetStateAction, useContext } from "react";
import { ErrorModalError, TotalYearsContext, PlanContext } from "./";
import { API } from "@graduate/api-client";
import { useRouter } from "next/router";
import { IsGuestContext } from "../../pages/_app";

interface ReqErrorModalProps {
  setHovered: (isHovered: SetStateAction<boolean>) => void;
  course: ScheduleCourse2<unknown>;
  term?: ScheduleTerm2<string>;
  preReqErr?: INEUReqError;
  coReqErr?: INEUReqError;
}

export const ReqErrorModal: React.FC<ReqErrorModalProps> = ({
  course,
  term,
  setHovered,
  coReqErr = undefined,
  preReqErr = undefined,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const totalYears = useContext(TotalYearsContext);
  const isFinalYear = term && parseInt(term.id[0]) === totalYears;
  const coopErr =
    course.name === COOP_TITLE &&
    term !== undefined &&
    (term.id === FALL_1 || (isFinalYear && term.season == SeasonEnum.SP));
  let msg = GENERIC_ERROR_MSG;
  if (coopErr && term.id === FALL_1) {
    msg = FALL_1_COOP_ERROR_MSG;
  } else if (coopErr) {
    msg = SPRING_4_COOP_ERROR_MSG;
  }
  return (
    <Flex
      justifySelf="stretch"
      alignSelf="stretch"
      _hover={{
        background: "primary.red.main",
        fill: "white",
        svg: { color: "white" },
      }}
      _active={{ background: "primary.red.900" }}
      onClick={() => {
        setHovered(false);
        onOpen();
      }}
    >
      <WarningIcon
        color="primary.red.main"
        width="2rem"
        alignSelf="center"
        alignItems="center"
        justifySelf="center"
        transition="background 0.15s ease"
      />
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textAlign="center"
            borderBottomWidth="1px"
            borderBottomColor="neutral.100"
          >
            <ModalCloseButton />
            <Flex
              alignItems="center"
              justifyContent="center"
              columnGap="2xs"
              color="primary.blue.dark.main"
            >
              <Text>Course Errors</Text>
              <HelperToolTip label="Some of these requirement errors may not be valid. We are continuously working towards making these as accurate as possible!" />
            </Flex>
            <Text fontWeight="normal" fontSize="sm">
              {getCourseDisplayString(course)}: {course.name}
            </Text>
          </ModalHeader>
          <ModalBody mb="sm">
            {coReqErr && (
              <Flex direction="column" mb="sm">
                <Flex
                  alignItems="center"
                  mb="xs"
                  columnGap="2xs"
                  justifyContent="left"
                >
                  <Text fontWeight="semibold" textAlign="center">
                    Co-requisite Errors
                  </Text>
                  <HelperToolTip
                    label={`You will need to statisfy the following requirement(s) along with ${getCourseDisplayString(
                      course
                    )}.`}
                  />
                </Flex>
                <ParseCourse
                  course={coReqErr}
                  parent={true}
                  term={term}
                  originalCourse={course}
                />
              </Flex>
            )}
            {(preReqErr || coopErr) && (
              <Flex direction="column">
                <Flex
                  alignItems="center"
                  mb="xs"
                  columnGap="2xs"
                  justifyContent="left"
                >
                  <Text fontWeight="semibold" textAlign="center">
                    Pre-requisite Errors
                  </Text>
                  <HelperToolTip
                    label={`You will need to statisfy the following requirement(s) before taking ${getCourseDisplayString(
                      course
                    )}.`}
                  />
                </Flex>
                <ParseCourse
                  course={preReqErr}
                  parent={true}
                  term={term}
                  originalCourse={course}
                />
              </Flex>
            )}
            {coopErr && (
              <ErrorModalError
                title="Cannot add co-op!"
                message={msg}
              ></ErrorModalError>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

interface ParseCourseProps {
  course?: INEUReqError;
  parent: boolean;
  term?: ScheduleTerm2<string>;
  originalCourse?: ScheduleCourse2<unknown>;
}

const ParseCourse: React.FC<ParseCourseProps> = ({
  course,
  parent,
  term,
  originalCourse,
}) => {
  // Use the context directly
  const plan = useContext(PlanContext);

  // Get student and mutateStudent
  const { student, mutateStudent } = useStudentWithPlans();

  const { course: fetchedCourse } = useFetchCourse(
    course?.subject || "",
    course?.classId || ""
  );

  const router = useRouter();
  const { isGuest } = useContext(IsGuestContext);

  if (!course || !plan) {
    return <></>;
  }

  const addCourseToPlan = async (
    course: INEUReqError,
    term: ScheduleTerm2<string>,
    originalCourse: ScheduleCourse2<unknown>
  ) => {
    if (fetchedCourse && student && originalCourse) {
      // Create updated plan
      const updatedPlan = addClassesToTerm(
        [fetchedCourse],
        parseInt(term.id[0]),
        term.season,
        plan
      );

      // Create updated student for optimistic update
      const updatedStudent = updatePlanForStudent(student, updatedPlan);

      // Use mutateStudent for optimistic updates
      mutateStudent(
        async () => {
          // Clean plan data before saving
          const cleanedPlan = cleanDndIdsFromPlan(updatedPlan);

          if (isGuest) {
            const cleanedPlanWithUpdatedTimeStamp = {
              ...cleanedPlan,
              updatedAt: new Date(),
            };
            window.localStorage.setItem(
              "student",
              JSON.stringify({
                ...student,
                plans: student.plans.map((p) =>
                  p.id === cleanedPlanWithUpdatedTimeStamp.id
                    ? cleanedPlanWithUpdatedTimeStamp
                    : p
                ),
              })
            );
          } else {
            await API.plans.update(updatedPlan.id, cleanedPlan);
          }
          return fetchStudentAndPrepareForDnd(isGuest);
        },
        {
          optimisticData: updatedStudent,
          rollbackOnError: true,
          revalidate: false,
        }
      ).catch((error) => {
        handleApiClientError(error, router);
      });
    }
  };

  switch (course.type) {
    case "course":
      return (
        <Flex align="center" justify={"space-between"}>
          <ReqCourseError courseError={course} isParent={parent} />
          <IconButton
            aria-label="Add class"
            icon={<AddIcon />}
            color="primary.blue.light.main"
            borderColor="primary.blue.light.main"
            colorScheme="primary.blue.light.main"
            isRound
            size="xs"
            ml="2"
            onClick={() =>
              term &&
              originalCourse &&
              addCourseToPlan(course, term, originalCourse)
            }
          />
        </Flex>
      );

    case "and":
      return (
        <>
          {course.missing.map((c, index) => (
            <Flex direction="column" key={index}>
              <BorderContainer>
                <ParseCourse
                  course={c}
                  parent={false}
                  term={term}
                  originalCourse={originalCourse}
                />
              </BorderContainer>
              {index < course.missing.length - 1 && (
                <Text fontSize="md" textAlign="center">
                  AND
                </Text>
              )}
            </Flex>
          ))}
        </>
      );

    case "or":
      return (
        <>
          {course.missing.map((c, index) => (
            <Flex direction="column" key={index}>
              <BorderContainer>
                <ParseCourse
                  course={c}
                  parent={false}
                  term={term}
                  originalCourse={originalCourse}
                />
              </BorderContainer>
              {index < course.missing.length - 1 && (
                <Text fontSize="md" textAlign="center">
                  OR
                </Text>
              )}
            </Flex>
          ))}
        </>
      );

    default:
      assertUnreachable(course);
  }
  return <></>;
};

const BorderContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box
      border="solid"
      borderWidth="thin"
      alignSelf="stretch"
      padding="xs"
      margin="3xs"
      borderRadius="lg"
      borderColor="grey"
    >
      {children}
    </Box>
  );
};

/** Fetches details for and renders a co-req/pre-req course. */
const ReqCourseError: React.FC<{
  courseError: INEUReqCourseError;
  isParent: boolean;
}> = ({ courseError, isParent }) => {
  const { course, error } = useFetchCourse(
    courseError.subject,
    courseError.classId
  );

  // Instead of JSX, use simple strings or components that won't cause nesting
  let displayContent;

  if (error) {
    displayContent = (
      <Flex alignItems="center" columnGap="2xs">
        <Text as="span" fontSize="md">
          {getCourseDisplayString(courseError)}
        </Text>
        <GraduateToolTip
          label={SEARCH_NEU_FETCH_COURSE_ERROR_MSG}
          placement="top"
        >
          <WarningTwoIcon boxSize="15px" color="states.warning.main" />
        </GraduateToolTip>
      </Flex>
    );
  } else if (course) {
    displayContent = `${getCourseDisplayString(course)}: ${course.name}`;
  } else {
    displayContent = `${getCourseDisplayString(courseError)}: Loading...`;
  }

  return (
    <>
      {isParent ? (
        <BorderContainer>
          {typeof displayContent === "string" ? (
            <Text fontSize="md">{displayContent}</Text>
          ) : (
            displayContent
          )}
        </BorderContainer>
      ) : typeof displayContent === "string" ? (
        <Text fontSize="md">{displayContent}</Text>
      ) : (
        displayContent
      )}
    </>
  );
};
