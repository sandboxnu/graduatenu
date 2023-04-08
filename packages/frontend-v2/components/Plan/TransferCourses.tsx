import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, Grid, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { ScheduleCourse2, StudentModel } from "@graduate/common";
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

interface TransferCoursesToggleProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export const TransferCourses: React.FC<TransferCoursesToggleProps> = ({
  isExpanded,
  toggleExpanded,
}) => {
  const { student, isLoading, mutateStudent } = useStudentWithPlans();
  const router = useRouter();

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
        await API.student.update(studentWithoutDndIds);
        return fetchStudentAndPrepareForDnd();
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
    <Flex direction="column" backgroundColor={"neutral.main"}>
      <TransferCoursesHeader
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        totalTransferCredits={totalTransferCredits}
      />
      {isExpanded && (
        <TransferCoursesBody
          transferCourses={transferCourses}
          updateTransferCourses={updateTransferCourses}
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
}

const TransferCoursesBody: React.FC<TransferCoursesBodyProps> = ({
  transferCourses,
  updateTransferCourses,
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
    >
      {transferCourses.map((course) => (
        <NonDraggableScheduleCourse
          key={getCourseDisplayString(course)}
          scheduleCourse={course}
          removeCourse={() => removeTransferCourse(course)}
        />
      ))}
      <AddCourseButton
        onOpen={onOpen}
        borderColor="#C1CAD9"
        borderWidth="1px"
        height="100%"
      />
      <AddCourseModal
        isOpen={isOpen}
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
    <Stack>
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
      _hover={{
        backgroundColor: "neutral.900",
      }}
      transition="background-color 0.15s ease"
      paddingTop="xs"
      paddingBottom="xs"
      onClick={toggleExpanded}
      cursor="pointer"
      userSelect="none"
      borderBottomWidth={isExpanded ? "2px" : "0px"}
      borderBottomColor="neutral.900"
      paddingX="md"
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" columnGap="2xs">
          <Text color="primary.blue.dark.main" fontWeight="bold">
            Your Transfer Courses
          </Text>
          <HelperToolTip label={transferCoursesHelperText} />
        </Flex>
        <Text color="primary.blue.light.main" fontWeight="bold">
          {totalTransferCredits} credits
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
