import React from "react";
import { DNDSchedule } from "../../models/types";
import { Major, ScheduleCourse } from "../../../../common/types";
import styled from "styled-components";
import { RequirementSection } from ".";
import {
  produceRequirementGroupWarning,
  getCompletedCourseStrings,
  getCreditsTakenInSchedule,
} from "../../utils";
import { AppState } from "../../state/reducers/state";
import {
  safelyGetActivePlanCatalogYearFromState,
  getActivePlanMajorFromState,
  getActivePlanScheduleFromState,
  safelyGetTransferCoursesFromState,
  getTakenCreditsFromState,
  getActivePlanCoopCycleFromState,
} from "../../state";
import { connect, useSelector } from "react-redux";
import { findMajorFromName } from "../../utils/plan-helpers";
import { ScrollWrapper } from "../../Onboarding/GenericOnboarding";
import { NORTHEASTERN_RED } from "../../constants";

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
  margin-bottom: -13px;
`;

const CoopCycleTitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-right: 12px;
  margin-left: 4px;
  margin-bottom: -10px;
`;

const CreditTitle = styled.p<any>`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  margin-right: 12px;
  margin-left: 4px;
  margin-bottom: 6px;
  color: ${props =>
    props.isGreen ? "rgba(21,116,62,0.68)" : NORTHEASTERN_RED};
`;

interface SidebarProps {
  isEditable: boolean;
}

interface MajorSidebarProps {
  schedule: DNDSchedule;
  coopCycle: string | null;
  major: Major;
  transferCourses: ScheduleCourse[];
  isEditable: boolean;
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
  coopCycle,
  major,
  transferCourses,
  isEditable,
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
      <ScrollWrapper>
        <MajorTitle>{major.name}</MajorTitle>
        {coopCycle ? <CoopCycleTitle>{coopCycle}</CoopCycleTitle> : null}
        <CreditTitle
          isGreen={
            getCreditsTakenInSchedule(schedule) >= major.totalCreditsRequired
          }
        >
          {`${getCreditsTakenInSchedule(schedule)} / ${
            major.totalCreditsRequired
          }` + " credits"}
        </CreditTitle>
        {major.requirementGroups.map((req, index) => {
          return (
            <RequirementSection
              title={!!req ? req : "Additional Requirements"}
              // TODO: this is a temporary solution for major scraper bug
              contents={major.requirementGroupMap[req]}
              warning={warnings.find(w => w.requirementGroup === req)}
              key={index + major.name}
              completedCourses={completedCourseStrings}
              isEditable={isEditable}
            />
          );
        })}
      </ScrollWrapper>
    </Container>
  );
};

export const Sidebar: React.FC<SidebarProps> = props => {
  const { schedule, major, transferCourses, coopCycle } = useSelector(
    (state: AppState) => ({
      major: getActivePlanMajorFromState(state),
      schedule: getActivePlanScheduleFromState(state),
      coopCycle: getActivePlanCoopCycleFromState(state),
      transferCourses: safelyGetTransferCoursesFromState(state),
    })
  );

  const { majorObj } = useSelector((state: AppState) => {
    return {
      majorObj: findMajorFromName(
        major,
        state.majorState.majors,
        safelyGetActivePlanCatalogYearFromState(state)
      ),
    };
  });

  return (
    <ScrollWrapper>
      {majorObj ? (
        <MajorSidebarComponent
          schedule={schedule}
          major={majorObj}
          coopCycle={coopCycle}
          transferCourses={transferCourses}
          isEditable={props.isEditable}
        />
      ) : (
        <NoMajorSidebarComponent />
      )}
    </ScrollWrapper>
  );
};
