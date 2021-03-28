import React, { useMemo } from "react";
import { DNDSchedule, IRequirementGroupWarning } from "../../models/types";
import { Concentration, Major, ScheduleCourse } from "../../../../common/types";
import styled from "styled-components";
import { RequirementSection } from ".";
import {
  produceRequirementGroupWarning,
  getCompletedCourseStrings,
  getCreditsTakenInSchedule,
  sumCreditsFromCourses,
} from "../../utils";
import { AppState } from "../../state/reducers/state";
import {
  safelyGetActivePlanCatalogYearFromState,
  getActivePlanMajorFromState,
  getActivePlanScheduleFromState,
  safelyGetTransferCoursesFromState,
  safelyGetActivePlanConcentrationFromState,
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

const ConcentrationTitle = styled.p`
  margin-left: 4px;
  font-size: 16px;
  font-weight: 600;
`;

const NoConcentrationTitle = styled.p`
  margin-left: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${NORTHEASTERN_RED};
`;

const ConcentrationRequirementGroup = styled.div`
  padding-left: 8px;
`;

interface SidebarProps {
  isEditable: boolean;
}

interface MajorSidebarProps {
  schedule: DNDSchedule;
  major: Major;
  concentration?: Concentration;
  transferCourses: ScheduleCourse[];
  isEditable: boolean;
}

interface ConcentrationProps {
  readonly concentration?: Concentration;
  readonly completedCourseStrings: string[];
  readonly warnings: IRequirementGroupWarning[];
  readonly isEditable: boolean;
  readonly concentrationIsRequired: boolean;
}

const NoMajorSidebarComponent: React.FC = () => {
  return (
    <Container>
      <MajorTitle>No major selected</MajorTitle>
    </Container>
  );
};

const ConcentrationComponent: React.FC<ConcentrationProps> = ({
  concentration,
  completedCourseStrings,
  warnings,
  isEditable,
  concentrationIsRequired,
}) => {
  const userConcentration = useSelector((state: AppState) =>
    safelyGetActivePlanConcentrationFromState(state)
  );

  if (concentrationIsRequired && !userConcentration) {
    return (
      <NoConcentrationTitle>No Concentration Selected</NoConcentrationTitle>
    );
  }

  if (!userConcentration) {
    return <></>;
  }

  return (
    <div>
      <ConcentrationTitle>{userConcentration} Concentration</ConcentrationTitle>
      {concentration?.requirementGroups?.map((req, index) => {
        return (
          <ConcentrationRequirementGroup>
            <RequirementSection
              title={req}
              contents={concentration.requirementGroupMap[req]}
              warning={warnings.find(w => w.requirementGroup === req)}
              key={`${index}-${userConcentration}-${req}`}
              completedCourses={completedCourseStrings}
              isEditable={isEditable}
            />
          </ConcentrationRequirementGroup>
        );
      })}
    </div>
  );
};

const MajorSidebarComponent: React.FC<MajorSidebarProps> = ({
  schedule,
  major,
  concentration,
  transferCourses,
  isEditable,
}) => {
  const warnings = produceRequirementGroupWarning(
    schedule,
    major,
    concentration
  );
  const completedCourses: string[] = getCompletedCourseStrings(schedule);
  const completedCourseStrings: string[] = transferCourses
    ? completedCourses.concat(
        ...transferCourses.map(course => course.subject + course.classId)
      )
    : completedCourses;
  const concentrationIsRequired = major.concentrations.minOptions > 0;

  const totalCredits = useMemo(() => {
    return (
      sumCreditsFromCourses(transferCourses) +
      getCreditsTakenInSchedule(schedule)
    );
  }, [transferCourses, schedule]);

  return (
    <Container>
      <ScrollWrapper>
        <MajorTitle>{major.name}</MajorTitle>
        <CreditTitle isGreen={totalCredits >= major.totalCreditsRequired}>
          {`${totalCredits} / ${major.totalCreditsRequired}` + " credits"}
        </CreditTitle>
        <ConcentrationComponent
          concentration={concentration}
          completedCourseStrings={completedCourseStrings}
          warnings={warnings}
          isEditable={isEditable}
          concentrationIsRequired={concentrationIsRequired}
        ></ConcentrationComponent>
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
  const { schedule, major, planConcentration, transferCourses } = useSelector(
    (state: AppState) => ({
      major: getActivePlanMajorFromState(state),
      planConcentration: safelyGetActivePlanConcentrationFromState(state),
      schedule: getActivePlanScheduleFromState(state),
      transferCourses: safelyGetTransferCoursesFromState(state),
    })
  );

  const majorObj = useSelector((state: AppState) =>
    findMajorFromName(
      major,
      state.majorState.majors,
      safelyGetActivePlanCatalogYearFromState(state)
    )
  );

  const concentrationObj = majorObj?.concentrations.concentrationOptions.find(
    (concentration: Concentration) => concentration.name === planConcentration
  );

  return (
    <ScrollWrapper>
      {majorObj ? (
        <MajorSidebarComponent
          schedule={schedule}
          major={majorObj}
          concentration={concentrationObj}
          transferCourses={transferCourses}
          isEditable={props.isEditable}
        />
      ) : (
        <NoMajorSidebarComponent />
      )}
    </ScrollWrapper>
  );
};
