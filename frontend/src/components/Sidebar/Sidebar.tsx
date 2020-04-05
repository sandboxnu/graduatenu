import React from "react";
import { DNDSchedule, Major, IRequiredCourse } from "../../models/types";
import styled from "styled-components";
import { RequirementSection } from ".";
import {
  produceRequirementGroupWarning,
  getCompletedCourseStrings,
} from "../../utils";
import { AppState } from "../../state/reducers/state";
import { getScheduleFromState, getMajorFromState } from "../../state";
import { connect } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
  padding: 12px;
`;

const MajorTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-right: 48px;
  margin-left: 4px;
  margin-bottom: 12px;
`;

interface Props {
  schedule: DNDSchedule;
  major?: Major;
}

const SidebarComponent: React.FC<Props> = ({ schedule, major }) => {
  if (!major) {
    return (
      <Container>
        <MajorTitle>No major selected</MajorTitle>
      </Container>
    );
  }

  const warnings = produceRequirementGroupWarning(schedule, major);
  const completedCourses: string[] = getCompletedCourseStrings(schedule);

  return (
    <Container>
      <MajorTitle>{major.name}</MajorTitle>
      {major.requirementGroups.map((req, index) => {
        return (
          <RequirementSection
            title={req}
            contents={major.requirementGroupMap[req]}
            warning={warnings.find(w => w.requirementGroup === req)}
            key={index}
            completedCourses={completedCourses}
          ></RequirementSection>
        );
      })}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
  major: getMajorFromState(state),
});

export const Sidebar = connect(mapStateToProps)(SidebarComponent);
