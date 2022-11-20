import { Box, Text } from "@chakra-ui/react";
import { SearchAPI } from "@graduate/api-client";
import {
  IRequiredCourse,
  Major2,
  MajorValidationError,
  MajorValidationResult,
  PlanModel,
  Requirement2,
  ScheduleCourse2,
  Section,
} from "@graduate/common";
import { memo, useEffect, useMemo, useState } from "react";
import SidebarSection from "./SidebarSection";
import { validateMajor2 } from "@graduate/common";
import { getAllCoursesFromPlan } from "../../utils/plan/getAllCoursesFromPlan";

interface SidebarProps {
  major: Major2;
  selectedPlan: PlanModel<string> | undefined;
}

// This was moved out of the Sidebar component as it doesn't change
// from run to run, but the dependency array in the course useEffect
// would have to include since if it stayed in the component according
// to the linter.
const getRequiredCourses = (
  requirements: Requirement2[],
  requiredCourses: IRequiredCourse[]
) => {
  for (const requirement of requirements) {
    if (requirement.type === "RANGE") {
      continue;
    } else if (requirement.type === "COURSE") {
      requiredCourses.push(requirement);
    } else if (requirement.type === "SECTION") {
      getRequiredCourses(requirement.requirements, requiredCourses);
    } else {
      getRequiredCourses(requirement.courses, requiredCourses);
    }
  }
};

const Sidebar: React.FC<SidebarProps> = memo(({ major, selectedPlan }) => {
  const validationStatus: MajorValidationResult | undefined = useMemo(() => {
    if (selectedPlan) {
      const takenCourses = getAllCoursesFromPlan(selectedPlan);
      return validateMajor2(major, takenCourses, undefined);
    } else {
      return undefined;
    }
  }, [selectedPlan, major]);

  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    const requirements = major.requirementSections.reduce(
      (courses: IRequiredCourse[], section: Section) => {
        const requiredCourses: IRequiredCourse[] = [];
        getRequiredCourses(section.requirements, requiredCourses);
        return courses.concat(requiredCourses);
      },
      []
    );

    const coursesQueryData: { subject: string; classId: string }[] = [];

    for (const requirement of requirements) {
      const subject = requirement.subject;
      const classId = requirement.classId.toString();
      coursesQueryData.push({ subject, classId });
    }

    SearchAPI.fetchCourses(coursesQueryData).then((courses) => {
      const courseMap: { [id: string]: ScheduleCourse2<null> } = {};
      if (courses) {
        for (const course of courses) {
          if (course) {
            courseMap[`${course.subject}${course.classId}`] = course;
          }
        }
        setCourseData(courseMap);
      }
    });
  }, [major.requirementSections]);

  return (
    <Box p="xs 0px" backgroundColor="neutral.main">
      <Text
        py="lg"
        px="sm"
        fontSize="xl"
        color="primary.red.main"
        fontWeight={700}
      >
        {major.name}
      </Text>
      {courseData &&
        major.requirementSections.map((section, index) => {
          let sectionValidationError: MajorValidationError | undefined =
            undefined;
          if (validationStatus && validationStatus.type == "Err") {
            if (!validationStatus.err.majorRequirementsError)
              throw new Error("Top level requirement should have an error.");
            if (validationStatus.err.majorRequirementsError.type !== "AND")
              throw new Error("Top level requirement error should be AND.");
            const andReq = validationStatus.err.majorRequirementsError?.error;
            if (andReq.type == "AND_UNSAT_CHILD") {
              sectionValidationError = andReq.childErrors.find((error) => {
                return error.childIndex === index;
              });
            } else if (
              andReq.type == "AND_NO_SOLUTION" &&
              andReq.discoveredAtChild == index
            ) {
              // If a range is invalid, but everything else is okay, it seems to create a No Solution error for that section.
              sectionValidationError = {
                type: "SECTION",
                sectionTitle: section.title,
                childErrors: [],
                minRequiredChildCount: 0,
                maxPossibleChildCount: 0,
              };
              // throw new Error("No solution found to major requirements.")
            }
          }

          return (
            <SidebarSection
              key={section.title}
              section={section}
              validationStatus={sectionValidationError}
              courseData={courseData}
              dndIdPrefix={"sidebar-" + index}
            />
          );
        })}
    </Box>
  );
});

// We need to manually set the display name like this because
// of how we're using memo above.
Sidebar.displayName = "Sidebar";

export { Sidebar };
