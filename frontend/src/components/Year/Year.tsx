import * as React from "react";
import styled from "styled-components";
import { DNDSchedule } from "../../models/types";
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
import SemesterContainer from "../Semester/SemesterContainer";
import { AddYearButton } from "../Schedule/AddYearButton";

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

const SemestersWrapper = styled.div`
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
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
    const semesters: SeasonWord[] = ["fall", "spring", "summer1", "summer2"];

    return (
      <div style={{ width: "100%" }}>
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
            {semesters.map((semester, i) => {
              const scheduleTerm = schedule.yearMap[year][semester];
              return (
                <SemesterContainer
                  isEditable={isEditable}
                  semester={scheduleTerm}
                  year={year}
                  semesterStatus={scheduleTerm.status as StatusEnum}
                  schedule={schedule}
                  transferCourses={this.props.transferCourses}
                  semesterWord={semester}
                  isExpanded={isExpanded}
                  key={i}
                />
              );
            })}
            {schedule.years.length === index + 1 && <AddYearButton />}
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
