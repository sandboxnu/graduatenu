import { Box, Text } from "@chakra-ui/react";
import { SearchAPI } from "@graduate/api-client";
import {
  IRequiredCourse,
  Requirement2,
  ScheduleCourse2,
  Section,
} from "@graduate/common";
import { useRouter } from "next/router";
import { memo, PropsWithChildren, useEffect, useState } from "react";
import { useMajor } from "../../hooks/useMajor";
import { handleApiClientError } from "../../utils";
import SidebarSection from "./SidebarSection";
import axios from "axios";

interface SidebarProps {
  majorName: string;
  catalogYear: number;
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

const Sidebar: React.FC<SidebarProps> = memo(({ majorName, catalogYear }) => {
  const router = useRouter();
  const [courseData, setCourseData] = useState({});
  const { major, isLoading, error } = useMajor(catalogYear, majorName);

  useEffect(() => {
    if (!major) {
      return;
    }

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
  }, [major]);

  if (isLoading) {
    return <SidebarContainer title="Loading..." />;
  }

  if (!major) {
    if (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return <SidebarContainer title="Major not found" />;
      }

      handleApiClientError(error, router);
    }

    return <SidebarContainer title="" />;
  }

  return (
    <SidebarContainer title={major.name}>
      {courseData &&
        major.requirementSections.map((section, index) => (
          <SidebarSection
            key={section.title}
            section={section}
            courseData={courseData}
            dndIdPrefix={"sidebar-" + index}
          />
        ))}
    </SidebarContainer>
  );
});

interface SidebarContainerProps {
  title: string;
}

export const SidebarContainer: React.FC<
  PropsWithChildren<SidebarContainerProps>
> = ({ title, children }) => {
  return (
    <Box p="xs 0px" backgroundColor="neutral.main">
      <Text
        py="lg"
        px="sm"
        fontSize="xl"
        color="primary.red.main"
        fontWeight={700}
      >
        {title}
      </Text>
      {children}
    </Box>
  );
};

// We need to manually set the display name like this because
// of how we're using memo above.
Sidebar.displayName = "Sidebar";

export { Sidebar };
