import { WarningIcon } from "@chakra-ui/icons";
import {
  Button, Flex, Modal,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Text, useDisclosure
} from "@chakra-ui/react";
import {
  assertUnreachable,
  courseToString,
  INEUPrereqError,
  ScheduleCourse2
} from "@graduate/common";

interface ReqErrorModalProps {
  course: ScheduleCourse2<string>,
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
          <ModalHeader>Course Errors for {courseToString(course)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="lg">CoReq Errors</Text>
            <ParseCourse course={coReqErr} />
            <Text fontSize="lg">PreReq Errors</Text>
            <ParseCourse course={preReqErr} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
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
      return <Text fontSize="sm">{courseToString(course)}</Text>;
    case "and":
      return (
        <>
          <Text fontSize="sm">AND</Text>
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
