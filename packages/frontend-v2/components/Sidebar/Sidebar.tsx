import { Box, Text } from "@chakra-ui/react";
import { SearchAPI } from "@graduate/api-client";
import {
  IAndCourse2,
  ICourseRange2,
  IOrCourse2,
  IRequiredCourse,
  IXofManyCourse,
  Major2,
  Requirement2,
  ScheduleCourse2,
  Section,
} from "@graduate/common";
import { useEffect, useState } from "react";
import { DraggableScheduleCourse, ScheduleCourse } from "../ScheduleCourse";
import { theme } from "../../utils/theme/index";

interface SidebarProps {
  major: Major2;
}

interface SidebarSectionProps {
  section: Section;
  courseData: { [id: string]: ScheduleCourse2<null> };
}

interface SidebarRequirementProps {
  requirement: Requirement2;
  courseData: { [id: string]: ScheduleCourse2<null> };
}

export const Sidebar: React.FC<SidebarProps> = ({ major }) => {
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

    const promises: Promise<ScheduleCourse2<null> | null>[] = [];

    for (const requirement of requirements) {
      promises.push(
        new Promise((res, rej) => {
          res({
            name: "FAKE API CALL, REPLACE!",
            classId: requirement.classId.toString(),
            subject: requirement.subject,
            numCreditsMin: 4,
            numCreditsMax: 4,
            id: null,
          });
        })
        // SearchAPI.fetchCourse(
        //   requirement.subject,
        //   requirement.classId.toString()
        // )
      );
    }

    Promise.all(promises).then((courses) => {
      const courseMap: { [id: string]: ScheduleCourse2<null> } = {};
      if (courses) {
        for (const course of courses) {
          if (course) {
            courseMap[`${course.subject}${course.classId}`] = course;
          }
        }
        console.log(courseMap);
        setCourseData(courseMap);
      }
    });
  }, []);

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
        major.requirementSections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            courseData={courseData}
          />
        ))}
    </Box>
  );
};

const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  courseData,
}) => {
  const [opened, setOpened] = useState(false);
  return (
    <Box
      backgroundColor="neutral.main"
      borderTop="1px solid white"
      cursor="pointer"
      userSelect="none"
    >
      <Text
        onClick={() => {
          setOpened(!opened);
        }}
        color="dark.main"
        fontWeight="bold"
        py="md"
        px="sm"
      >
        {section.title}
      </Text>
      <Box
        style={{ display: opened ? "" : "none" }}
        backgroundColor="neutral.900"
        padding="10px 20px 15px 10px"
        cursor="default"
      >
        {section.requirements.map((requirement) => (
          <SectionRequirement
            requirement={requirement}
            courseData={courseData}
          />
        ))}
      </Box>
    </Box>
  );
};

const SectionRequirement: React.FC<SidebarRequirementProps> = ({
  requirement,
  courseData,
}) => {
  const renderRequirement = () => {
    switch (requirement.type) {
      case "XOM":
        return renderXOM(requirement);
      case "AND":
        return renderAND(requirement);
      case "OR":
        return renderOR(requirement);
      case "RANGE":
        return renderRange(requirement);
      case "COURSE":
        return renderCourse(requirement);
      case "SECTION":
        return renderSection(requirement);
      default:
        return <p>Unsupported type</p>;
    }
  };

  const renderXOM = (requirement: IXofManyCourse) => {
    return (
      <div>
        <p>Complete {requirement.numCreditsMin} credits from the following</p>
        {requirement.courses.map((course) => (
          <SectionRequirement requirement={course} courseData={courseData} />
        ))}
      </div>
    );
  };

  const renderAND = (requirement: IAndCourse2) => {
    return (
      <div>
        <p>Complete all of the following</p>
        {requirement.courses.map((course) => (
          <SectionRequirement requirement={course} courseData={courseData} />
        ))}
      </div>
    );
  };

  const renderOR = (requirement: IOrCourse2) => {
    return (
      <div>
        <p>Complete one of the following</p>
        {requirement.courses.map((course) => (
          <SectionRequirement requirement={course} courseData={courseData} />
        ))}
      </div>
    );
  };

  const renderRange = (requirement: ICourseRange2) => {
    return (
      <p>
        Complete any course in range {requirement.subject}
        {requirement.idRangeStart} to {requirement.subject}
        {requirement.idRangeEnd}
      </p>
    );
  };

  const renderCourse = (requirement: IRequiredCourse) => {
    const courseKey = `${requirement.subject}${requirement.classId}`;
    const scheduleCourse = courseData[courseKey];

    if (scheduleCourse) {
      return (
        <DraggableScheduleCourse
          scheduleCourse={{ ...scheduleCourse, id: scheduleCourse.classId }}
          isFromSidebar={true}
          isDisabled={false}
        />
      );
    }
    return <p>Course not found</p>;
  };

  const renderSection = (requirement: Section) => {
    return <SidebarSection section={requirement} courseData={courseData} />;
  };

  return (
    <Box pl="xs" pt="xs">
      {renderRequirement()}
    </Box>
  );
};
