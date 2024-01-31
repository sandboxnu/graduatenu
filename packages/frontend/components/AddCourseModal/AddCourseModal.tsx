import { InfoIcon } from "@chakra-ui/icons";
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
  Text,
  Flex,
} from "@chakra-ui/react";
import { ScheduleCourse2 } from "@graduate/common";
import { useState } from "react";
import { useSearchCourses } from "../../hooks";
import {
  isEqualCourses,
  getCourseDisplayString,
  getRequiredCourseCoreqs,
} from "../../utils";
import { SearchCoursesInput } from "./SearchCoursesInput";
import { SearchResult } from "./SearchResult";
import { SelectedCourse } from "./SelectedCourse";
import { GraduateToolTip } from "../GraduateTooltip";
import { HelperToolTip } from "../Help";

interface AddCourseModalProps {
  isOpen: boolean;
  catalogYear?: number;
  /** Function to close the modal UX, returned from the useDisclosure chakra hook */
  closeModalDisplay: () => void;

  /** Function to check if the given course exists in the plan being displayed. */
  isCourseAlreadyAdded: (course: ScheduleCourse2<unknown>) => boolean;

  /** Function to add classes to the curr term in the plan being displayed. */
  addSelectedClasses: (courses: ScheduleCourse2<null>[]) => void;

  /** Should we autoselect coreqs for courses that are selected. */
  isAutoSelectCoreqs?: boolean;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  catalogYear,
  closeModalDisplay,
  isCourseAlreadyAdded,
  addSelectedClasses,
  isAutoSelectCoreqs,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<
    ScheduleCourse2<null>[]
  >([]);
  const [isLoadingSelectCourse, setIsLoadingSelectCourse] = useState(false);

  const {
    courses,
    isLoading: isCoursesLoading,
    error,
  } = useSearchCourses(searchQuery, catalogYear);

  const addSelectedCourse = async (course: ScheduleCourse2<null>) => {
    // don't allow courses to be selected multiple times
    if (isCourseAlreadySelected(course)) {
      return;
    }

    setIsLoadingSelectCourse(true);
    const updatedSelectedCourses = [...selectedCourses];

    // grab any coreqs of the course that haven't already been selected/added to the term
    const coreqs = isAutoSelectCoreqs
      ? (await getRequiredCourseCoreqs(course, catalogYear)).filter((coreq) => {
          const isAlreadySelected = selectedCourses.find((selectedCourse) =>
            isEqualCourses(selectedCourse, coreq)
          );
          const isAlreadyAdded = isCourseAlreadyAdded(coreq);
          return !(isAlreadyAdded || isAlreadySelected);
        })
      : [];

    updatedSelectedCourses.push(course, ...coreqs);

    setSelectedCourses(updatedSelectedCourses);
    setIsLoadingSelectCourse(false);
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

  const addClassesOnClick = async () => {
    if (selectedCourses.length === 0) {
      return;
    }

    addSelectedClasses(selectedCourses);
    onClose();
  };

  const onClose = () => {
    setSelectedCourses([]);
    setSearchQuery("");
    closeModalDisplay();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="primary.blue.dark.main">
          <Flex alignItems="center" justifyContent="center" columnGap="2xs">
            <Text>Add Courses</Text>
            <HelperToolTip label="We try our best to search for courses across as many semesters as possible. If you cannot find your course, please report a bug with your plan catalog year and we will try to solve it as soon as possible." />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" rowGap="md">
            <SearchCoursesInput setSearchQuery={setSearchQuery} />
            <VStack
              height="200px"
              overflow="scroll"
              alignItems="left"
              gap="2xs"
            >
              {error && (
                <GraduateToolTip label="We rely on SearchNEU to search for courses, and there may be an ongoing issue on their end. We recommend refreshing the page and trying again soon. If the issue persists, help us by clicking the Bug/Feature button to report the bug">
                  <Flex
                    alignItems="center"
                    columnGap="xs"
                    justifyContent="center"
                  >
                    <InfoIcon color="primary.blue.dark.main" />
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      textAlign="center"
                    >
                      Oops, sorry we couldn&apos;t search for courses... try
                      again in a little bit!
                    </Text>
                  </Flex>
                </GraduateToolTip>
              )}
              {courses &&
                courses.map((searchResult) => (
                  <SearchResult
                    key={getCourseDisplayString(searchResult)}
                    searchResult={searchResult}
                    addSelectedCourse={addSelectedCourse}
                    isResultAlreadyAdded={isCourseAlreadyAdded(searchResult)}
                    isResultAlreadySelected={isCourseAlreadySelected(
                      searchResult
                    )}
                    isSelectingAnotherCourse={isLoadingSelectCourse}
                  />
                ))}
              {!error && (!courses || courses.length === 0) && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  columnGap="xs"
                >
                  <InfoIcon color="primary.blue.dark.main" />
                  <Text fontSize="xs">
                    Search for your course and press enter to see search
                    results.
                  </Text>
                </Flex>
              )}
            </VStack>
            {courses && courses.length > 0 && selectedCourses.length === 0 && (
              <Flex alignItems="center" justifyContent="center" columnGap="xs">
                <InfoIcon color="primary.blue.dark.main" />
                <Text fontSize="xs">
                  Select the courses you wish to add to this semester using the
                  &quot;+&quot; button.
                </Text>
              </Flex>
            )}
            <VStack maxHeight="200px" overflow="scroll" pb="xs">
              {selectedCourses.map((selectedCourse) => (
                <SelectedCourse
                  key={getCourseDisplayString(selectedCourse)}
                  selectedCourse={selectedCourse}
                  removeSelectedCourse={removeSelectedCourse}
                />
              ))}
            </VStack>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Flex columnGap="sm">
            <Button
              variant="solidWhite"
              size="md"
              borderRadius="lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              borderRadius="lg"
              size="md"
              onClick={addClassesOnClick}
              isLoading={isCoursesLoading}
            >
              Add
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};