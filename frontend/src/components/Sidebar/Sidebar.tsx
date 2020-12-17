import React from "react";
import { DNDSchedule } from "../../models/types";
import { Major, ScheduleCourse } from "../../../../common/types";
import styled from "styled-components";
import { RequirementSection } from ".";
import {
  produceRequirementGroupWarning,
  getCompletedCourseStrings,
} from "../../utils";
import { AppState } from "../../state/reducers/state";
import {
  getActivePlanMajorFromState,
  getActivePlanScheduleFromState,
  getTransferCoursesFromState,
} from "../../state";
import { connect, useSelector } from "react-redux";
import { findMajorFromName } from "../../utils/plan-helpers";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  padding: 0px 12px 12px 10px;
`;

const MajorTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-right: 12px;
  margin-left: 4px;
  margin-bottom: 12px;
`;

interface MajorSidebarProps {
  schedule: DNDSchedule;
  major: Major;
  transferCourses: ScheduleCourse[];
}

const NoMajorSidebarComponent: React.FC = () => {
  return (
    <Container>
      <MajorTitle>No major selected</MajorTitle>
    </Container>
  );
};

const MajorSidebarComponent: React.FC<MajorSidebarProps> = ({
  schedule,
  major,
  transferCourses,
}) => {
  const warnings = produceRequirementGroupWarning(schedule, major);
  const completedCourses: string[] = getCompletedCourseStrings(schedule);
  const completedCourseStrings: string[] = transferCourses
    ? completedCourses.concat(
        ...transferCourses.map(course => course.subject + course.classId)
      )
    : completedCourses;

  return (
    <Container>
      <MajorTitle>{major.name}</MajorTitle>
      {major.requirementGroups.map((req, index) => {
        return (
          <RequirementSection
            title={!!req ? req : "Additional Requirements"}
            // TODO: this is a temporary solution for major scraper bug
            contents={major.requirementGroupMap[req]}
            warning={warnings.find(w => w.requirementGroup === req)}
            key={index + major.name}
            completedCourses={completedCourseStrings}
          ></RequirementSection>
        );
      })}
    </Container>
  );
};

export const Sidebar: React.FC = () => {
  const { schedule, major, transferCourses } = useSelector(
    (state: AppState) => ({
      major: getActivePlanMajorFromState(state),
      schedule: getActivePlanScheduleFromState(state),
      transferCourses: getTransferCoursesFromState(state),
    })
  );
  const { majorObj } = useSelector((state: AppState) => ({
    majorObj: findMajorFromName(major, state.majorState.majors),
  }));

  return majorObj ? (
    <MajorSidebarComponent
      schedule={schedule}
      major={majorObj}
      transferCourses={transferCourses}
    />
  ) : (
    <NoMajorSidebarComponent />
  );
};
