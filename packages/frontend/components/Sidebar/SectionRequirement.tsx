import { Box, Text } from "@chakra-ui/react";
import {
  IAndCourse2,
  ICourseRange2,
  IOrCourse2,
  IRequiredCourse,
  IXofManyCourse,
  Requirement2,
  ScheduleCourse2,
  Section,
} from "@graduate/common";
import {
  DraggableScheduleCourse,
  PlaceholderScheduleCourse,
} from "../ScheduleCourse";
import { SidebarValidationStatus } from "./Sidebar";
import SidebarSection from "./SidebarSection";
import { getCourseDisplayString } from "../../utils";

interface SidebarRequirementProps {
  requirement: Requirement2;
  courseData: { [id: string]: ScheduleCourse2<null> };
  dndIdPrefix: string;
  coursesTaken: ScheduleCourse2<unknown>[];
}

const SectionRequirement: React.FC<SidebarRequirementProps> = ({
  requirement,
  courseData,
  dndIdPrefix,
  coursesTaken,
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
        throw new Error(`Unreachable code! Unknown sidebar section type.`);
    }
  };

  const isCourseInPlan = (requirement: Requirement2): boolean => {
    let isTrue = false;
    console.log(requirement, " AsdASDASJKDas");
    if (coursesTaken) {
      coursesTaken.forEach((course) => {
        if (
          requirement.type === "COURSE" &&
          course.classId === requirement.classId.toString()
        ) {
          console.log("This is true");
          isTrue = true;
        }
      });
    }
    console.log(isTrue, " is the");
    return isTrue;
  };

  const renderXOM = (requirement: IXofManyCourse) => {
    return (
      <div>
        <Text fontSize="sm" as="i">
          Complete {requirement.numCreditsMin} credits from the following:
        </Text>
        {requirement.courses.map((course, index) => (
          <SectionRequirement
            requirement={course}
            courseData={courseData}
            coursesTaken={coursesTaken}
            dndIdPrefix={dndIdPrefix + "-" + index}
            key={index}
          />
        ))}
      </div>
    );
  };

  const renderAND = (requirement: IAndCourse2) => {
    return (
      <div>
        <Text fontSize="sm" as="i">
          Complete all of the following:
        </Text>
        {requirement.courses.map((course, index) => (
          <SectionRequirement
            requirement={course}
            courseData={courseData}
            coursesTaken={coursesTaken}
            dndIdPrefix={dndIdPrefix + "-" + index}
            key={index}
          />
        ))}
      </div>
    );
  };

  const renderOR = (requirement: IOrCourse2) => {
    return (
      <div>
        <Text fontSize="sm" as="i">
          Complete 1 of the following:
        </Text>
        {requirement.courses.map((course, index) => (
          <SectionRequirement
            requirement={course}
            courseData={courseData}
            coursesTaken={coursesTaken}
            dndIdPrefix={dndIdPrefix + "-" + index}
            key={index}
          />
        ))}
      </div>
    );
  };

  const renderRange = (requirement: ICourseRange2) => {
    return (
      <Text fontSize="sm" as="i">
        Complete any course in range {requirement.subject}
        {requirement.idRangeStart} to {requirement.subject}
        {requirement.idRangeEnd}{" "}
        {requirement.exceptions.length > 0 && (
          <>
            except{" "}
            {requirement.exceptions.map(getCourseDisplayString).join(", ")}
          </>
        )}
      </Text>
    );
  };

  const renderCourse = (requirement: IRequiredCourse) => {
    const courseKey = `${requirement.subject}${requirement.classId}`;
    const scheduleCourse = courseData[courseKey];

    if (scheduleCourse) {
      return (
        <DraggableScheduleCourse
          scheduleCourse={{
            ...scheduleCourse,
            id: dndIdPrefix + "-" + courseKey,
          }}
          isInSidebar
          // TODO: isChecked is for when the requirement is added to the plan and validated. When true, this will render a checkmark.
          isChecked={isCourseInPlan(requirement)}
          isDisabled={false}
        />
      );
    }

    return <PlaceholderScheduleCourse course={requirement} />;
  };

  const renderSection = (requirement: Section) => {
    return (
      <SidebarSection
        validationStatus={SidebarValidationStatus.Complete}
        section={requirement}
        courseData={courseData}
        coursesTaken={coursesTaken}
        dndIdPrefix={dndIdPrefix + "-sec"}
      />
    );
  };

  return (
    <Box pl="xs" pt="xs">
      {renderRequirement()}
    </Box>
  );
};

export default SectionRequirement;
