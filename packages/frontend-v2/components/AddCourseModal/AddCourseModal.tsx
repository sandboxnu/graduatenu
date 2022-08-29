import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
} from "@chakra-ui/react";
import { SearchAPI } from "@graduate/api-client";
import { ScheduleCourse2 } from "@graduate/common";
import { useState } from "react";
import {
  isEqualCourses,
  getCourseDisplayString,
  getRequiredCourseCoreqs,
} from "../../utils";
import { SearchCoursesInput } from "./SearchCoursesInput";
import { SearchResult } from "./SearchResult";
import { SelectedCourse } from "./SelectedCourse";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCourseInCurrSchedule: (course: ScheduleCourse2<unknown>) => boolean;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  isCourseInCurrSchedule,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ScheduleCourse2<null>[]>(
    []
  );
  const [selectedCourses, setSelectedCourses] = useState<
    ScheduleCourse2<null>[]
  >([]);

  const searchCourses = async () => {
    if (searchTerm !== "") {
      setIsLoading(true);
      const results = await SearchAPI.searchCourses(searchTerm);
      setIsLoading(false);
      setSearchResults(results);
    }
  };

  const addSelectedCourse = async (course: ScheduleCourse2<null>) => {
    // don't allow courses to be selected multiple times
    if (isCourseAlreadySelected(course)) {
      return;
    }

    const updatedSelectedCourses = [...selectedCourses];

    // push course + any coreqs of the course
    const coreqs = await getRequiredCourseCoreqs(course);
    updatedSelectedCourses.push(course, ...coreqs);

    setSelectedCourses(updatedSelectedCourses);
  };

  const removeSelectedCourse = (course: ScheduleCourse2<null>) => {
    const updatedSelectedCourses = selectedCourses.filter(
      (selectedCourse) => !isEqualCourses(selectedCourse, course)
    );

    setSelectedCourses(updatedSelectedCourses);
  };

  const isCourseAlreadySelected = (course: ScheduleCourse2<null>) => {
    return selectedCourses.some((selectedCourse) =>
      isEqualCourses(selectedCourse, course)
    );
  };

  const onCloseModal = () => {
    setSearchResults([]);
    setSelectedCourses([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Courses</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SearchCoursesInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchCourses={searchCourses}
            setSearchResults={setSearchResults}
          />
          <VStack
            height="200px"
            mt="md"
            overflow="scroll"
            alignItems="left"
            gap="2xs"
          >
            {searchResults.map((searchResult) => (
              <SearchResult
                key={getCourseDisplayString(searchResult)}
                searchResult={searchResult}
                addSelectedCourse={addSelectedCourse}
                isResultAlreadyInSchedule={isCourseInCurrSchedule(searchResult)}
                isResultAlreadySelected={isCourseAlreadySelected(searchResult)}
              />
            ))}
          </VStack>
          <VStack maxHeight="200px" mt="md" overflow="scroll" pb="xs">
            {selectedCourses.map((selectedCourse) => (
              <SelectedCourse
                key={getCourseDisplayString(selectedCourse)}
                selectedCourse={selectedCourse}
                removeSelectedCourse={removeSelectedCourse}
              />
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            fontWeight="bold"
            color="primary.blue.light.main"
            colorScheme="neutral"
            backgroundColor="neutral.main"
            border="none"
            mr={3}
            onClick={onCloseModal}
            textTransform="uppercase"
            isLoading={isLoading}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
