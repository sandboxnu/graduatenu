import { WarningIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { courseEq, courseToString, INEUPrereqError } from "@graduate/common";

interface ReqErrorModalProps {
  preReqErr: INEUPrereqError | undefined;
  coReqErr: INEUPrereqError | undefined;
}

export const ReqErrorModal: React.FC<ReqErrorModalProps> = ({
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
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{parseCourse(coReqErr)}</ModalBody>

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

// Look through the course error until there are no more errors!
const parseCourse = (course: INEUPrereqError | undefined): string => {
  if (course == undefined) {
    return "";
  }

  let out = "";

  switch (course["type"]) {
    case "course":
      // code block
      out = courseToString(course);
      break;
    case "and":
      for (const req of course.missing) {
        out += parseCourse(req);
      }
      break;
    case "or":
      for (const req of course.missing) {
        out += parseCourse(req);
      }
      break;
    default:
      return "idk :)";
  }

  return out;
};
