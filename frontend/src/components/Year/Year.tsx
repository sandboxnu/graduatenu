import * as React from "react";
import styled from "styled-components";
import { YearTop } from ".";
import { SemesterBlock } from "../";
import { DNDSchedule, DNDScheduleTerm } from "../../models/types";
import { SEMESTER_MIN_HEIGHT } from "../../constants";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {
  safelyGetAcademicYearFromState,
  getClosedYearsFromState,
  safelyGetTransferCoursesFromState,
} from "../../state";
import { AppState } from "../../state/reducers/state";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { toggleYearExpandedForActivePlanAction } from "../../state/actions/userPlansActions";
import {
  ScheduleCourse,
  SeasonWord,
  StatusEnum,
} from "../../../../common/types";
import SemesterContainer from "../SemesterContainer";

interface ReduxStoreYearProps {
  academicYear: number;
  closedYears: Set<number>;
  transferCourses: ScheduleCourse[];
}

interface ReduxDispatchYearProps {
  toggleYearExpanded: (yearIndex: number) => void;
}

interface YearProps {
  index: number;
  schedule: DNDSchedule;
  isEditable: boolean;
  collapsibleYears: boolean;
}

type Props = ReduxStoreYearProps & ReduxDispatchYearProps & YearProps;

const YearTopWrapper = styled.div<any>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-left: ${props => (props.collapsibleYears ? "-28px" : "-4px")};
`;

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
`;

const SemestersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
`;

class YearComponent extends React.Component<Props> {
  handleExpandedChange() {
    this.props.toggleYearExpanded(this.props.index);
  }

  render() {
    const { index, schedule, isEditable, collapsibleYears } = this.props;
    const year = schedule.years[index];
    const isExpanded = !this.props.closedYears.has(index) || !isEditable;

    return (
      <div style={{ width: "100%", marginBottom: 28 }}>
        <YearTopWrapper collapsibleYears={collapsibleYears}>
          <div
            onClick={this.handleExpandedChange.bind(this)}
            style={{ marginRight: 4, marginTop: 5 }}
          >
            {collapsibleYears &&
              (isExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              ))}
          </div>
          <SemestersWrapper>
            <SemesterContainer
              isEditable={isEditable}
              semester={schedule.yearMap[year].fall}
              year={year}
              semesterStatus={schedule.yearMap[year].fall.status as StatusEnum}
              schedule={schedule}
              transferCourses={this.props.transferCourses}
              semesterWord={"fall"}
              isExpanded={isExpanded}
            />
            <SemesterContainer
              isEditable={isEditable}
              semester={schedule.yearMap[year].spring}
              year={year}
              semesterStatus={
                schedule.yearMap[year].spring.status as StatusEnum
              }
              schedule={schedule}
              transferCourses={this.props.transferCourses}
              semesterWord={"spring"}
              isExpanded={isExpanded}
            />
            <SemesterContainer
              isEditable={isEditable}
              semester={schedule.yearMap[year].summer1}
              year={year}
              semesterStatus={
                schedule.yearMap[year].summer1.status as StatusEnum
              }
              schedule={schedule}
              transferCourses={this.props.transferCourses}
              semesterWord={"summer1"}
              isExpanded={isExpanded}
            />
            <SemesterContainer
              isEditable={isEditable}
              semester={schedule.yearMap[year].summer2}
              year={year}
              semesterStatus={
                schedule.yearMap[year].summer2.status as StatusEnum
              }
              schedule={schedule}
              transferCourses={this.props.transferCourses}
              semesterWord={"summer2"}
              isExpanded={isExpanded}
            />
          </SemestersWrapper>
        </YearTopWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  academicYear: safelyGetAcademicYearFromState(state)!,
  closedYears: getClosedYearsFromState(state),
  transferCourses: safelyGetTransferCoursesFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleYearExpanded: (yearIndex: number) =>
    dispatch(toggleYearExpandedForActivePlanAction(yearIndex)),
});

export const Year = connect<
  ReduxStoreYearProps,
  ReduxDispatchYearProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(YearComponent);
