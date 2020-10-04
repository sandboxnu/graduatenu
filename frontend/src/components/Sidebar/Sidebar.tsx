import React from "react";
import { DNDSchedule } from "../../models/types";
import {
  Major,
  IRequiredCourse,
  ScheduleCourse,
} from "../../../../common/types";
import styled from "styled-components";
import { RequirementSection } from ".";
import {
  produceRequirementGroupWarning,
  getCompletedCourseStrings,
} from "../../utils";
import { AppState } from "../../state/reducers/state";
import {
  getScheduleFromState,
  getDeclaredMajorFromState,
  getTransferCoursesFromState,
} from "../../state";
import { connect } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  padding: 21px 12px 12px 10px;
`;

const MajorTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-right: 12px;
  margin-left: 4px;
  margin-bottom: 12px;
`;

interface Props {
  schedule: DNDSchedule;
  major?: Major;
  transferCourses: ScheduleCourse[];
}

const SidebarComponent: React.FC<Props> = ({
  schedule,
  major,
  transferCourses,
}) => {
  if (!major) {
    return (
      <Container>
        <MajorTitle>No major selected</MajorTitle>
      </Container>
    );
  }

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
            title={req}
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

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
  major: getDeclaredMajorFromState(state),
  transferCourses: getTransferCoursesFromState(state),
});

export const Sidebar = connect(mapStateToProps)(SidebarComponent);
