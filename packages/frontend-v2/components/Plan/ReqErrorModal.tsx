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
  INEUPrereqError,
  ScheduleCourse2,
} from "@graduate/common";
import { useState } from "react";

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
  const [page, setPage] = useState(0);
  console.log(coReqErr);
  console.log(preReqErr);

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
            {coReqErr && page == 0 && (
              <Flex direction="column">
                <Text fontWeight="semibold" mb="xs" textAlign="center">
                  CoReq Errors
                </Text>
                <ParseCourse course={coReqErr} parent={true} />
              </Flex>
            )}
            {preReqErr && (page == 1 || !coReqErr) && (
              <Flex direction="column">
                <Text fontWeight="semibold" mb="xs" textAlign="center">
                  PreReq Errors
                </Text>
                <ParseCourse course={preReqErr} parent={true} />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Flex
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Button
                variant="solidRed"
                mr={3}
                onClick={() => {
                  onClose();
                  setPage(0);
                }}
              >
                Close
              </Button>
              {coReqErr && preReqErr && (
                <Text fontSize="sm">{`Page ${page + 1} of 2`}</Text>
              )}
              {coReqErr && preReqErr && (
                <Button
                  variant="solidBlue"
                  mr={3}
                  onClick={() => setPage(page == 0 ? 1 : 0)}
                >
                  {page == 0 ? "Next" : "Prev"}
                </Button>
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

interface ParseCourseProps {
  course: INEUPrereqError | undefined;
  parent: boolean;
}

// Look through the course error until there are no more errors!
// TODO: Fix the styling!
const ParseCourse: React.FC<ParseCourseProps> = ({ course, parent }) => {
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
        <Flex direction="column">
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
          {/* {parent ? (
            <BorderContainer>
              {course.missing.map((c, index) => (
                <Flex direction="column" key={index}>
                  <ParseCourse course={c} parent={false} />
                  {index < course.missing.length - 1 && (
                    <Text fontSize="md" textAlign='center'>AND</Text>
                  )}
                </Flex>
              ))}
            </BorderContainer>
          ) : (
            <>
              {course.missing.map((c, index) => (
                <BorderContainer key={index}>
                  <ParseCourse course={c} parent={false} />
                  {index < course.missing.length - 1 && (
                    <Text fontSize="md" textAlign='center'>AND</Text>
                  )}
                </BorderContainer>
              ))}
            </>
          )} */}
        </Flex>
      );
    case "or":
      return (
        <Flex direction="column">
          {course.missing.map((c, index) => (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              key={index}
            >
              <BorderContainer>
                <ParseCourse course={c} parent={false} />
              </BorderContainer>
              {index < course.missing.length - 1 && (
                <Text fontSize="md">OR</Text>
              )}
            </Flex>
          ))}
        </Flex>
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
