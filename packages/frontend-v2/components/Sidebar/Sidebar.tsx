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
import { DraggableScheduleCourse } from "../ScheduleCourse";
import SidebarSection from "./SidebarSection";
import { validateMajor2 } from "@graduate/common";
import { getAllCoursesFromPlan } from "../../utils/plan/getAllCoursesFromPlan";
import { getSectionError } from "../../utils/plan/getSectionError";

interface SidebarProps {
  major: Major2;
  selectedPlan: PlanModel<string> | undefined;
}

const COOP_BLOCK: ScheduleCourse2<string> = {
  name: "Co-op Education",
  classId: "Experiential Learning",
  subject: "CO-OP",
  numCreditsMax: 8,
  numCreditsMin: 8,
  id: "co-op-block",
};

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
  const [loading, setLoading] = useState(true);

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
      const courseMap: { [id: string]: ScheduleCourse2<null> } = courseData;
      if (courses) {
        for (const course of courses) {
          if (course) {
            courseMap[`${course.subject}${course.classId}`] = course;
          }
        }
        setCourseData(courseMap);
        setLoading(false);
      }
    });
    // We don't want to make another request when only courseData changes,
    // we're just appending to it rather than replacing it, hence the
    // technical dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Box padding="10px 20px 15px 20px">
        <DraggableScheduleCourse
          scheduleCourse={COOP_BLOCK}
          isFromSidebar={true}
          isDisabled={false}
        />
      </Box>
      {courseData &&
        major.requirementSections.map((section, index) => {
          const sectionValidationError: MajorValidationError | undefined =
            getSectionError(index, validationStatus);

          const sectionIsValid =
            selectedPlan !== undefined && sectionValidationError === undefined;

          return (
            <SidebarSection
              key={section.title}
              section={section}
              isValid={sectionIsValid}
              courseData={courseData}
              dndIdPrefix={"sidebar-" + index}
              loading={loading}
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
