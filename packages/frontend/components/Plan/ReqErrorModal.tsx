import { AddIcon, WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  assertUnreachable,
  INEUReqCourseError,
  INEUReqError,
  ReqErrorType,
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
  getCourseDisplayString,
} from "../../utils";
import { useFetchCourse, useStudentWithPlans } from "../../hooks";
import { GraduateToolTip } from "../GraduateTooltip";
import { SetStateAction, useContext } from "react";
import { ErrorModalError, TotalYearsContext, PlanContext } from "./";
import { IsGuestContext } from "../../pages/_app";
import { GreenCheckIcon } from "../Icon/GreenCheckIcon";
import { useSelectedCourses } from "../../hooks/useSelectedCourses";
import {
  ClassesToAddBundle,
  useMutateStudentWithPlan,
} from "../../hooks/useMutateStudentWithPlan";
import { shiftYearAndSeason } from "../../utils/plan/shiftYearAndSeason";

interface ReqErrorModalProps {
  course: ScheduleCourse2<unknown>;
  term?: ScheduleTerm2<string>;
  setHovered: (isHovered: SetStateAction<boolean>) => void;
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

  // selected co-requisite courses
  const {
    selectedCourses: selectedCoreqCourses,
    addSelectedCourse: addSelectedCoreqCourse,
    isCourseAlreadySelected: isCoreqCourseAlreadySelected,
    clearSelectedCourses: clearSelectedCoreqCourses,
  } = useSelectedCourses();

  // selected pre-requisite courses
  const {
    selectedCourses: selectedPrereqCourses,
    addSelectedCourse: addSelectedPrereqCourse,
    isCourseAlreadySelected: isPrereqCourseAlreadySelected,
    clearSelectedCourses: clearSelectedPrereqCourses,
  } = useSelectedCourses();

  const isCourseAlreadySelected = (course: ScheduleCourse2<null>) => {
    return (
      isCoreqCourseAlreadySelected(course) ||
      isPrereqCourseAlreadySelected(course)
    );
  };

  const plan = useContext(PlanContext);
  const { isGuest } = useContext(IsGuestContext);
  const { student, mutateStudent } = useStudentWithPlans();

  const { addAllClassesToTermsInCurrentPlan } = useMutateStudentWithPlan(
    isGuest,
    student,
    mutateStudent,
    plan
  );

  const addClassesOnClick = () => {
    if (
      selectedCoreqCourses.length + selectedPrereqCourses.length === 0 ||
      !term
    ) {
      return;
    }
    const prevSemesterShift = shiftYearAndSeason(
      parseInt(term.id[0]),
      term.season,
      -1
    );
    const classesForCurrentSemester: ClassesToAddBundle = {
      classes: selectedCoreqCourses,
      termYear: parseInt(term.id[0]),
      termSeason: term.season,
    };
    const classesForPrevSemester: ClassesToAddBundle = {
      classes: selectedPrereqCourses,
      termYear: prevSemesterShift.year,
      termSeason: prevSemesterShift.season,
    };

    addAllClassesToTermsInCurrentPlan([
      classesForCurrentSemester,
      classesForPrevSemester,
    ]);
    onCloseModal();
  };

  const onCloseModal = () => {
    clearSelectedCoreqCourses();
    clearSelectedPrereqCourses();
    onClose();
  };

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
      <Modal
        isOpen={isOpen}
        onClose={onCloseModal}
        scrollBehavior="inside"
        size="3xl"
      >
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
              <Flex direction="column" mb="sm" gap={4}>
                <Flex direction="column">
                  <Text fontWeight="bold" fontSize={"lg"}>
                    Co-requisite Errors
                  </Text>
                  <Text fontStyle={"italic"}>
                    {`You will need to statisfy the following requirement(s) along with 
                    ${getCourseDisplayString(course)}.`}
                  </Text>
                </Flex>
                <ParseCourse
                  course={coReqErr}
                  parent={true}
                  term={term}
                  originalCourse={course}
                  addSelectedCourse={addSelectedCoreqCourse}
                  isCourseAlreadySelected={isCourseAlreadySelected}
                />
              </Flex>
            )}
            {(preReqErr || coopErr) && (
              <Flex direction="column" gap={4}>
                <Flex direction="column">
                  <Text fontWeight="bold" fontSize={"lg"}>
                    Pre-requisite Errors
                  </Text>
                  <Text fontStyle={"italic"}>
                    {`You will need to statisfy the following requirement(s) before taking 
                      ${getCourseDisplayString(course)}.`}
                  </Text>
                </Flex>
                <ParseCourse
                  course={preReqErr}
                  parent={true}
                  term={term}
                  originalCourse={course}
                  addSelectedCourse={addSelectedPrereqCourse}
                  isCourseAlreadySelected={isCourseAlreadySelected}
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
          {selectedCoreqCourses.length + selectedPrereqCourses.length > 0 && (
            <ModalFooter justifyContent="end" gap="md">
              <Button
                leftIcon={<AddIcon />}
                variant="solid"
                borderRadius="lg"
                backgroundColor="primary.blue.light.main"
                borderColor="primary.blue.light.main"
                colorScheme="primary.blue.light.main"
                onClick={addClassesOnClick}
                isDisabled={
                  selectedCoreqCourses.length + selectedPrereqCourses.length ===
                  0
                }
              >
                Add Courses
              </Button>
            </ModalFooter>
          )}
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
  nestedIn?: ReqErrorType;
  neighborCount?: number; // the amount of courses at the same level as this course (including this course)
  addSelectedCourse: (course: ScheduleCourse2<null>) => void;
  isCourseAlreadySelected: (course: ScheduleCourse2<null>) => boolean;
}

/**
 * Recursively parses co and pre-requisite errors and renders them in a modal.
 * Following the design specs provided here:
 * https://www.figma.com/design/yUflVFVxjMynm7gGymLpQY/%F0%9F%8F%97-Current-Work?node-id=6269-37326&t=sLw3yqhmIftbNc8j-4
 * here are the rules for rendering the errors:
 *
 * - If a COURSE is standalone or at the top-level, render it with a border
 *   container. Otherwise, render it without a border container.
 * - If multiple courses are nested in an OR statement, render it with the "Choose
 *   ONE of the following" text and no border between courses.
 * - If multiple courses are nested in an OR statement and the OR statement is
 *   top-level, render each course with a border container.
 * - If multiple courses are nested in an AND statement, render each section with
 *   a border container
 */
const ParseCourse: React.FC<ParseCourseProps> = ({
  course,
  parent,
  term,
  originalCourse,
  nestedIn,
  neighborCount,
  addSelectedCourse,
  isCourseAlreadySelected,
}) => {
  // Use the context directly
  const plan = useContext(PlanContext);

  const { course: fetchedCourse, isLoading: courseIsLoading } = useFetchCourse(
    course?.subject || "",
    course?.classId || ""
  );

  if (!course || !plan) {
    return <></>;
  }

  switch (course.type) {
    case ReqErrorType.COURSE: {
      const isCourseSelected =
        fetchedCourse && isCourseAlreadySelected(fetchedCourse);
      const content = (
        <Flex align="center" justify={"space-between"} paddingLeft={2}>
          <ReqCourseError courseError={course} isParent={parent} />
          {isCourseSelected ? (
            <GreenCheckIcon />
          ) : (
            <IconButton
              aria-label="Add class"
              icon={<AddIcon />}
              color="primary.blue.light.main"
              borderColor="primary.blue.light.main"
              colorScheme="primary.blue.light.main"
              isRound
              size="xs"
              ml="2"
              onClick={() => fetchedCourse && addSelectedCourse(fetchedCourse)}
              isDisabled={courseIsLoading}
            />
          )}
        </Flex>
      );
      // renders border if not nested in any requirement error
      if (
        (neighborCount && neighborCount == 1) ||
        nestedIn == undefined ||
        nestedIn == ReqErrorType.AND
      ) {
        return <BorderContainer>{content}</BorderContainer>;
      } else {
        return content;
      }
    }
    case ReqErrorType.AND:
      return (
        <>
          {course.missing.map((c, index) => (
            <Flex direction="column" key={index}>
              <ParseCourse
                course={c}
                parent={false}
                term={term}
                originalCourse={originalCourse}
                nestedIn={ReqErrorType.AND}
                neighborCount={course.missing.reduce(
                  (acc, curr) =>
                    acc + (curr.type == ReqErrorType.COURSE ? 1 : 0),
                  0
                )}
                addSelectedCourse={addSelectedCourse}
                isCourseAlreadySelected={isCourseAlreadySelected}
              />
            </Flex>
          ))}
        </>
      );
    case ReqErrorType.OR: {
      // renders requirement errors with OR text if it is a top-level OR statement
      if (!nestedIn) {
        return (
          <>
            {course.missing.map((c, index) => (
              <Flex direction="column" key={index}>
                <ParseCourse
                  course={c}
                  parent={false}
                  term={term}
                  originalCourse={originalCourse}
                  nestedIn={ReqErrorType.OR}
                  neighborCount={1} // set to 1 since all top-level OR statement should render courses with border
                  addSelectedCourse={addSelectedCourse}
                  isCourseAlreadySelected={isCourseAlreadySelected}
                />
                {index < course.missing.length - 1 && (
                  <Text fontSize="md" textAlign="center" fontWeight="semibold">
                    OR
                  </Text>
                )}
              </Flex>
            ))}
          </>
        );
      } else {
        return (
          <>
            <BorderContainer>
              <Flex
                direction="column"
                align="left"
                justify={"space-between"}
                paddingLeft={2}
              >
                <Text fontSize="md" textAlign="left" fontWeight="semibold">
                  Choose ONE of the following:
                </Text>
                <Divider />
              </Flex>

              {course.missing.map((c, index) => (
                <Flex direction="column" key={index}>
                  <Flex
                    direction="column"
                    paddingTop={2}
                    paddingBottom={2}
                    paddingLeft={8}
                  >
                    <ParseCourse
                      course={c}
                      parent={false}
                      term={term}
                      originalCourse={originalCourse}
                      nestedIn={ReqErrorType.OR}
                      addSelectedCourse={addSelectedCourse}
                      isCourseAlreadySelected={isCourseAlreadySelected}
                    />
                  </Flex>
                  {index < course.missing.length - 1 && <Divider />}
                </Flex>
              ))}
            </BorderContainer>
          </>
        );
      }
    }
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
    displayContent = (
      <Flex alignItems="center" columnGap="2xs">
        <Text as="span" fontSize="md" fontWeight="semibold">
          {getCourseDisplayString(course) + ":"}
        </Text>
        <Text as="span" fontSize="md">
          {course.name}
        </Text>
      </Flex>
    );
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
