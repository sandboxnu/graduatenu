import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, Grid, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { ScheduleCourse2, SeasonEnum, StudentModel } from "@graduate/common";
import { useRouter } from "next/router";
import { fetchStudentAndPrepareForDnd, useStudentWithPlans } from "../../hooks";
import {
  cleanDndIdsFromStudent,
  getCourseDisplayString,
  handleApiClientError,
  isEqualCourses,
} from "../../utils";
import { AddCourseButton, AddCourseModal } from "../AddCourseModal";
import { HelperToolTip } from "../Help";
import { NonDraggableScheduleCourse } from "../ScheduleCourse";
import { useContext } from "react";
import { IsGuestContext } from "../../pages/_app";

interface TransferCoursesToggleProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
  year: number;
}

/**
 * This component is responsible for displaying the student's transfer courses,
 * but the UI text displays it as "Overriden Courses" for purpose clarity.
 */
export const TransferCourses: React.FC<TransferCoursesToggleProps> = ({
  isExpanded,
  toggleExpanded,
  year,
}) => {
  const { student, isLoading, mutateStudent } = useStudentWithPlans();
  const router = useRouter();
  const { isGuest } = useContext(IsGuestContext);

  /*
  Simply refrain from displaying the transfer courses section if 
  the student can't be fetched. Top level page would've handled
  the error.
  */
  if (isLoading) {
    return <></>;
  }

  if (!student) {
    return <></>;
  }

  const transferCourses = student.coursesTransfered || [];
  const totalTransferCredits = transferCourses.reduce(
    (sum, course) => course.numCreditsMin + sum,
    0
  );

  const updateTransferCourses = (
    updatedTransferCourses: ScheduleCourse2<null>[]
  ) => {
    const updatedStudent: StudentModel<string> = {
      ...student,
      coursesTransfered: updatedTransferCourses,
    };

    mutateStudent(
      async () => {
        // have to clean all dnd ids before sending the student to our API
        const studentWithoutDndIds = cleanDndIdsFromStudent(updatedStudent);
        if (isGuest) {
          window.localStorage.setItem(
            "student",
            JSON.stringify(studentWithoutDndIds)
          );
        } else {
          await API.student.update(studentWithoutDndIds);
        }
        return fetchStudentAndPrepareForDnd(isGuest);
      },
      {
        optimisticData: updatedStudent,
        rollbackOnError: true,
        revalidate: false,
      }
    ).catch((error) => {
      handleApiClientError(error, router);
    });
  };

  return (
    <Flex direction="column" backgroundColor={"neutral.100"}>
      <TransferCoursesHeader
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        totalTransferCredits={totalTransferCredits}
        year={year}
      />
      {isExpanded && (
        <TransferCoursesBody
          transferCourses={transferCourses}
          updateTransferCourses={updateTransferCourses}
          year={year}
        />
      )}
    </Flex>
  );
};

interface TransferCoursesBodyProps {
  transferCourses: ScheduleCourse2<null>[];
  updateTransferCourses: (
    updateTransferCourses: ScheduleCourse2<null>[]
  ) => void;
  year: number;
}

const TransferCoursesBody: React.FC<TransferCoursesBodyProps> = ({
  transferCourses,
  updateTransferCourses,
  year,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isTransferCoursesAlreadyAdded = (course: ScheduleCourse2<unknown>) => {
    return transferCourses.some((transferCourse) =>
      isEqualCourses(transferCourse, course)
    );
  };

  const addTransferCourses = (newTransferCourses: ScheduleCourse2<null>[]) => {
    updateTransferCourses([...transferCourses, ...newTransferCourses]);
  };

  const removeTransferCourse = (courseToRemove: ScheduleCourse2<null>) => {
    const updatedTransferCourses = transferCourses.filter(
      (transferCourse) => !isEqualCourses(courseToRemove, transferCourse)
    );
    updateTransferCourses(updatedTransferCourses);
  };

  return (
    <Grid
      paddingX="mid"
      margin="md"
      templateColumns="repeat(4, 1fr)"
      rowGap="sm"
      columnGap="sm"
      alignItems="stretch"
    >
      {transferCourses.map((course) => (
        <NonDraggableScheduleCourse
          key={getCourseDisplayString(course)}
          scheduleCourse={course}
          removeCourse={() => removeTransferCourse(course)}
        />
      ))}
      <AddCourseButton onOpen={onOpen} />
      <AddCourseModal
        //is season really necessary? i have placeholder here
        season={SeasonEnum.FL}
        catalogYear={year}
        isOpen={isOpen}
        addTo="Overriden Courses"
        closeModalDisplay={onClose}
        addSelectedClasses={addTransferCourses}
        isCourseAlreadyAdded={isTransferCoursesAlreadyAdded}
      />
    </Grid>
  );
};

interface TransferCoursesHeaderProps extends TransferCoursesToggleProps {
  totalTransferCredits: number;
}

const TransferCoursesHeader: React.FC<TransferCoursesHeaderProps> = ({
  isExpanded,
  toggleExpanded,
  totalTransferCredits,
}) => {
  const transferCoursesHelperText = (
    <Stack py="xs">
      <Text>Northeastern courses that you have credits for.</Text>
      <Text>
        These are courses you do not need to take because you complete advanced
        examinations in high school or college-level courses at an accredited
        higher education institution.
      </Text>
      <Text>
        We use this data to check the requirements you satisfy for you major.
      </Text>
    </Stack>
  );
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="neutral.50"
      _hover={{
        backgroundColor: "neutral.100",
      }}
      _active={{
        backgroundColor: "neutral.200",
      }}
      transition="background-color 0.15s ease"
      paddingTop="xs"
      paddingBottom="xs"
      onClick={toggleExpanded}
      cursor="pointer"
      userSelect="none"
      borderBottomWidth={isExpanded ? "2px" : "0px"}
      borderBottomColor="neutral.200"
      paddingX="md"
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" columnGap="2xs">
          <Text color="primary.blue.dark.main" fontWeight="bold">
            Your Overriden Courses
          </Text>
          <HelperToolTip label={transferCoursesHelperText} />
        </Flex>
        <Text color="primary.blue.light.main" fontWeight="bold">
          {totalTransferCredits}{" "}
          {totalTransferCredits === 1 ? "Credit" : "Credits"}
        </Text>
      </Flex>
      {isExpanded ? (
        <ChevronUpIcon boxSize={6} />
      ) : (
        <ChevronDownIcon boxSize={6} />
      )}
    </Flex>
  );
};
