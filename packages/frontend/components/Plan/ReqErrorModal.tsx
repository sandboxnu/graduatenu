import { WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
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
} from "@graduate/common";
import { HelperToolTip } from "../Help";
import {
  COOP_TITLE,
  FALL_1,
  FALL_1_COOP_ERROR_MSG,
  GENERIC_ERROR_MSG,
  SEARCH_NEU_FETCH_COURSE_ERROR_MSG,
  SPRING_4,
  SPRING_4_COOP_ERROR_MSG,
  getCourseDisplayString,
} from "../../utils";
import { useFetchCourse } from "../../hooks";
import { GraduateToolTip } from "../GraduateTooltip";
import { SetStateAction } from "react";
import { ErrorModalError } from "./";

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

  const coopErr =
    course.name === COOP_TITLE &&
    term !== undefined &&
    (term.id === FALL_1 || term.id === SPRING_4);
  let msg = GENERIC_ERROR_MSG;
  if (coopErr && term.id === FALL_1) {
    msg = FALL_1_COOP_ERROR_MSG;
  } else if (coopErr && term.id === SPRING_4) {
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
                  justifyContent="center"
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
                <ParseCourse course={coReqErr} parent={true} />
              </Flex>
            )}
            {(preReqErr || coopErr) && (
              <Flex direction="column">
                <Flex
                  alignItems="center"
                  mb="xs"
                  columnGap="2xs"
                  justifyContent="center"
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
                <ParseCourse course={preReqErr} parent={true} />
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
}

// Look through the course error until there are no more errors!
// TODO: Fix the styling!
const ParseCourse: React.FC<ParseCourseProps> = ({
  course = undefined,
  parent,
}) => {
  if (course == undefined) {
    return <></>;
  }

  switch (course.type) {
    case "course":
      return <ReqCourseError courseError={course} isParent={parent} />;

    case "and":
      return (
        <>
          {course.missing.map((c, index) => (
            <Flex direction="column" key={index}>
              <BorderContainer>
                <ParseCourse course={c} parent={false} />
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
                <ParseCourse course={c} parent={false} />
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

  /** Render only the course id when loading or if we can't fetch the course name. */
  let content = (
    <Text fontSize="md">{getCourseDisplayString(courseError)}: Loading...</Text>
  );

  if (error) {
    content = (
      <Flex alignItems="center" columnGap="2xs">
        <Text fontSize="md">{getCourseDisplayString(courseError)}</Text>
        <GraduateToolTip
          label={SEARCH_NEU_FETCH_COURSE_ERROR_MSG}
          placement="top"
        >
          <WarningTwoIcon boxSize="15px" color="states.warning.main" />
        </GraduateToolTip>
      </Flex>
    );
  }

  if (course) {
    content = (
      <Text fontSize="md">
        {getCourseDisplayString(course)}: {course.name}
      </Text>
    );
  }

  return (
    <>
      {isParent ? (
        <BorderContainer>
          <Text fontSize="md">{content}</Text>
        </BorderContainer>
      ) : (
        <Text fontSize="md">{content}</Text>
      )}
    </>
  );
};
