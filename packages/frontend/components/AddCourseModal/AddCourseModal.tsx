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
  Stack,
  Divider,
} from "@chakra-ui/react";
import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";
import { useEffect, useState } from "react";
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
import { NUPathCheckBox } from "./NUPathCheckBox";

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
  const [filteredNuPaths, setFilteringNUPaths] = useState<NUPathEnum[]>([]);

  useEffect(() => {
    setSearchQuery((searchQuery) => searchQuery + " ");
  }, [filteredNuPaths]);

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
    console.log("removing course");
    if (selectedCourses.length === 0) {
      return;
    }

    addSelectedClasses(selectedCourses);
    onClose();
  };

  // filters the given list of courses by nuPaths within the
  const filterClassesByPaths = (
    classes: ScheduleCourse2<null>[]
  ): ScheduleCourse2<null>[] => {
    if (filteredNuPaths.length == 0) {
      return classes;
    }

    const filteredCourses = classes.filter((course) => hasFilteredPath(course));

    console.log("filtered courses: ");
    console.log(filteredCourses);

    return filteredCourses;
  };

  // sorts the list of courses by how many NUPaths are contained within a course
  const sortByNUPath = (
    classes: ScheduleCourse2<null>[]
  ): ScheduleCourse2<null>[] => {
    const sortedCourses = classes.sort(byFilteredPath);
    return sortedCourses;
  };

  const byFilteredPath = (
    course: ScheduleCourse2<null>,
    courseTwo: ScheduleCourse2<null>
  ): number => {
    return countFilteredPaths(course) - countFilteredPaths(courseTwo);
  };

  const countFilteredPaths = (course: ScheduleCourse2<null>): number => {
    if (course.nupaths == null) {
      return -1;
    }
    let count = 0;
    course.nupaths.forEach((element) => {
      if (filteredNuPaths.includes(element)) {
        count++;
      }
    });

    return count;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hasFilteredPath = (course: ScheduleCourse2<null>): boolean => {
    console.log(filteredNuPaths);
    let isInFilter = false;
    filteredNuPaths.forEach((curPath) => {
      if (course.nupaths != null && course.nupaths.includes(curPath)) {
        console.log("detected " + curPath + " in " + course.name);
        isInFilter = true;
      }
    });
    return isInFilter;
  };

  const onClose = () => {
    setSelectedCourses([]);
    setSearchQuery("");
    closeModalDisplay();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent minWidth="fit-content" height="fit-content">
        <ModalHeader
          color="primary.blue.dark.main"
          margin-bottom="0"
          paddingBottom="0"
          marginLeft="0"
          marginRight="0"
          paddingLeft="0"
          paddingRight="0"
        >
          <Flex alignItems="center" justifyContent="center" columnGap="2xs">
            <Text>Add Courses</Text>
            <HelperToolTip label="We try our best to search for courses across as many semesters as possible. If you cannot find your course, please report a bug with your plan catalog year and we will try to solve it as soon as possible." />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          margin-bottom="0"
          paddingBottom="0"
          marginLeft="0"
          marginRight="0"
          paddingLeft="0"
          paddingRight="0"
        >
          <Divider
            borderWidth="2px"
            colorScheme="gray"
            bg="gray"
            orientation="horizontal"
            flexGrow="1"
          />
          <Flex direction="row" justifyContent="left">
            {/* NUPath sidebar */}
            <Flex direction="row">
              <Flex
                direction="column"
                justifyContent="left"
                bg="gray.50"
                w="250px"
                margin-right="0"
                paddingRight="0"
                paddingLeft="20px"
                paddingTop="0"
              >
                <Flex pt="50px" pb="20px">
                  <Text fontSize="lg" as="b">
                    NUPath
                  </Text>
                </Flex>
                <Flex direction="row" justifyContent="left" pr="20px">
                  <Flex justifyContent="center">
                    <Stack spacing={1} direction="column">
                      <NUPathCheckBox
                        abbreviation="ND"
                        label="Natural/Designed World"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.ND}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="EI"
                        label="Creative/Expressive Inov"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.EI}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="IC"
                        label="Interpreting Culture"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.IC}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="FQ"
                        label="Formal/Quant Reasoning"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.FQ}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="SI"
                        label="Societies/Institutions"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.SI}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="AD"
                        label="Analyzing/Using Data"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.AD}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="DD"
                        label="Difference Diversity"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.DD}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="ER"
                        label="Ethical Reasoning"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.ER}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="WF"
                        label="First Year Writing"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.WF}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="WD"
                        label="Advanced Writing"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.WD}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="WI"
                        label="Writing Intensive"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.WI}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="EX"
                        label="Integration Experience"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.EX}
                        setPathState={setFilteringNUPaths}
                      />
                      <NUPathCheckBox
                        abbreviation="CE"
                        label="Capstone Experience"
                        filteredPaths={filteredNuPaths}
                        associatedPath={NUPathEnum.CE}
                        setPathState={setFilteringNUPaths}
                      />
                    </Stack>
                  </Flex>
                </Flex>
              </Flex>
              <Divider
                borderWidth="2px"
                colorScheme="gray"
                alignSelf="stretch"
                orientation="vertical"
              />
            </Flex>
            {/* End NUPath Sidebar */}

            {/* Course Work Area */}
            <Flex direction="column" rowGap="md" flexGrow="2">
              <Flex px="10px" margin="0.5" pt="10px">
                <SearchCoursesInput setSearchQuery={setSearchQuery} />
              </Flex>
              <VStack
                height="200px"
                overflow="scroll"
                alignItems="left"
                gap="2xs"
                px="5px"
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
                  sortByNUPath(filterClassesByPaths(courses)).map(
                    (searchResult) => (
                      <SearchResult
                        key={getCourseDisplayString(searchResult)}
                        searchResult={searchResult}
                        addSelectedCourse={addSelectedCourse}
                        isResultAlreadyAdded={isCourseAlreadyAdded(
                          searchResult
                        )}
                        isResultAlreadySelected={isCourseAlreadySelected(
                          searchResult
                        )}
                        isSelectingAnotherCourse={isLoadingSelectCourse}
                        filteredPaths={filteredNuPaths}
                      />
                    )
                  )}
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
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  columnGap="xs"
                >
                  <InfoIcon color="primary.blue.dark.main" />
                  <Text fontSize="xs">
                    Select the courses you wish to add to this semester using
                    the &quot;+&quot; button.
                  </Text>
                </Flex>
              )}

              <Divider
                borderWidth="2px"
                bg="gray.100"
                orientation="horizontal"
              />

              {/* Selected Courses Area */}
              <Flex alignItems="flex-start" justifyContent="left">
                <Text fontSize="lg">Courses to Add:</Text>
              </Flex>
              <VStack maxHeight="200px" overflow="scroll" pb="xs">
                {selectedCourses.map((selectedCourse) => (
                  <SelectedCourse
                    key={getCourseDisplayString(selectedCourse)}
                    selectedCourse={selectedCourse}
                    removeSelectedCourse={removeSelectedCourse}
                    filteredPaths={filteredNuPaths}
                  />
                ))}
              </VStack>
            </Flex>
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
              backgroundColor="primary.blue.light.main"
              borderColor="primary.blue.light.main"
              colorScheme="primary.blue.light.main"
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
