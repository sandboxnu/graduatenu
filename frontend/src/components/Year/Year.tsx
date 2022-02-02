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
import { ScheduleCourse, StatusEnum } from "../../../../common/types";

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
  align-items: center;
  margin-left: ${props => (props.collapsibleYears ? "-28px" : "-4px")};
`;

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
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
            style={{ marginRight: 4 }}
          >
            {collapsibleYears &&
              (isExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              ))}
          </div>
          <YearTop
            year={year}
            fallStatus={schedule.yearMap[year].fall.status}
            springStatus={schedule.yearMap[year].spring.status}
            summer1Status={schedule.yearMap[year].summer1.status}
            summer2Status={schedule.yearMap[year].summer2.status}
            schedule={schedule}
            isEditable={isEditable}
            transferCourses={this.props.transferCourses}
          />
        </YearTopWrapper>
        {isExpanded && (
          <YearBody>
            <SemesterBlock
              isEditable={isEditable}
              semester={schedule.yearMap[year].fall}
            />
            <SemesterBlock
              isEditable={isEditable}
              semester={schedule.yearMap[year].spring}
            />
            <SemesterBlock
              isEditable={isEditable}
              semester={schedule.yearMap[year].summer1}
            />
            <SemesterBlock
              isEditable={isEditable}
              semester={schedule.yearMap[year].summer2}
            />
          </YearBody>
        )}
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
