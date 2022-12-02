import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
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
  INEUReqError,
  ScheduleCourse2,
} from "@graduate/common";

interface ReqErrorModalProps {
  course: ScheduleCourse2<string>;
  preReqErr?: INEUReqError;
  coReqErr?: INEUReqError;
}

export const ReqErrorModal: React.FC<ReqErrorModalProps> = ({
  course,
  coReqErr = undefined,
  preReqErr = undefined,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            backgroundColor="#D9D9D9"
            borderTopRadius="md"
          >
            Course Errors for {courseToString(course)}
          </ModalHeader>
          <ModalBody>
            {coReqErr && (
              <Flex direction="column">
                <Text fontWeight="semibold" mb="xs" textAlign="center">
                  CoRequisite Errors
                </Text>
                <ParseCourse course={coReqErr} parent={true} />
              </Flex>
            )}
            {preReqErr && (
              <Flex direction="column">
                <Text fontWeight="semibold" mb="xs" textAlign="center">
                  PreRequisite Errors
                </Text>
                <ParseCourse course={preReqErr} parent={true} />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Flex justifyContent="end" width="100%" alignItems="center">
              <Button variant="solidBlue" mr={3} onClick={onClose}>
                Close
              </Button>
            </Flex>
          </ModalFooter>
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
      return (
        <>
          {parent ? (
            <BorderContainer>
              <Text fontSize="md">{courseToString(course)}</Text>
            </BorderContainer>
          ) : (
            <Text fontSize="md">{courseToString(course)}</Text>
          )}
        </>
      );

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
