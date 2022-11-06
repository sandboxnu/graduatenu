import { WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  assertUnreachable,
  courseToString,
  INEUPrereqError,
  ScheduleCourse2,
} from "@graduate/common";

interface ReqErrorModalProps {
  course: ScheduleCourse2<string>;
  preReqErr: INEUPrereqError | undefined;
  coReqErr: INEUPrereqError | undefined;
}

export const ReqErrorModal: React.FC<ReqErrorModalProps> = ({
  course,
  coReqErr,
  preReqErr,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <WarningIcon
        color="primary.red.main"
        transition="color 0.1s ease"
        onClick={() => {
          onOpen();
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textAlign="center"
            backgroundColor="#D9D9D9"
            borderTopRadius="md"
          >
            Course Errors for {courseToString(course)}
          </ModalHeader>
          <ModalBody>
            <Text fontSize="sm" mb="sm" color="red" textAlign="center">
              It looks like you are missing prerequisites for this course
            </Text>
            <Text fontWeight="semibold" mb="xs">{`${courseToString(
              course
            )} requires the following:`}</Text>
            {coReqErr && (
              <Flex direction="column">
                <Text fontWeight="semibold">CoReq Errors</Text>
                <ParseCourse course={coReqErr} />
              </Flex>
            )}
            {preReqErr && (
              <Flex direction="column">
                <Text fontWeight="semibold">PreReq Errors</Text>
                <ParseCourse course={preReqErr} />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface ParseCourseProps {
  course: INEUPrereqError | undefined;
}

// Look through the course error until there are no more errors!
const ParseCourse: React.FC<ParseCourseProps> = ({ course }) => {
  if (course == undefined) {
    return <></>;
  }

  switch (course.type) {
    case "course":
      return <Text fontSize="md">{courseToString(course)}</Text>;
    case "and":
      return (
        <>
          <Text fontSize="md">AND</Text>
          <Flex ml="1rem" direction="column">
            {course.missing.map((c, index) => (
              <ParseCourse course={c} key={index} />
            ))}
          </Flex>
        </>
      );
    case "or":
      return (
        <>
          <Text fontSize="sm">OR</Text>
          <Flex ml="1rem" direction="column">
            {course.missing.map((c, index) => (
              <ParseCourse course={c} key={index} />
            ))}
          </Flex>
        </>
      );
    default:
      assertUnreachable(course);
  }
  return <></>;
};
