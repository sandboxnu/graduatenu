import * as React from "react";
import styled from "styled-components";
import { ScheduleCourse, SeasonWord, Status } from "../../../../common/types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { changeSemesterStatusForActivePlanAction } from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import { SemesterType } from "./SemesterType";
import { DNDSchedule } from "../../models/types";
import { getPositionOfYearInSchedule } from "../../utils";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 36px;
  background-color: #eb5757;
  border: 1px solid #eb5757;
  box-sizing: border-box;
  margin-top: 0px;
  padding: 0px;
  width: 100%;
`;

const SemesterText = styled.p`
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SemesterTopProps {
  year: number;
  status: Status;
  schedule: DNDSchedule;
  isEditable: boolean;
  transferCourses: ScheduleCourse[];
}

interface ReduxDispatchSemesterTopProps {
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord,
    transferCourses: ScheduleCourse[]
  ) => void;
}

type Props = SemesterTopProps &
  ReduxDispatchSemesterTopProps &
  SemesterTopState;

interface SemesterTopState {
  tappedSemester?: SeasonWord;
  status: Status;
  semester: SeasonWord;
}

export const SemesterTopComponent = (props: Props) => {
  const [status, setStatus] = React.useState(props.status);

  /**
   * Updates this year's semester status labels when a change is made in a parent component.
   * Removes HOVER from status for displaying purposes.
   * @param nextProps the next set of props to be received.
   */

  React.useEffect(() => {
    let status: Status = props.status;
    if (status === "HOVERCOOP" || status === "HOVERINACTIVE") {
      status = status.replace("HOVER", "") as Status;
    }
    setStatus(status);
  }, [props.status]);

  /**
   * Triggers when a semester status is changed.
   * Updates this component's label state and dispatches the status change to the schedule.
   */
  const handleChange = (event: any, tappedSemester: SeasonWord) => {
    const curStatus: Status = event.target.value;

    setStatus(curStatus);

    props.handleStatusChange(
      curStatus,
      props.year,
      tappedSemester,
      props.transferCourses
    );
  };

  const { year, schedule, isEditable } = props;
  const yearPosition = getPositionOfYearInSchedule(schedule, year);
  const semesterMapping = {
    fall: "Fall",
    spring: "Spring",
    summer1: "Summer I",
    summer2: "Summer II",
  };

  return (
    <Container>
      <div style={textContainerStyle}>
        <SemesterText>
          {semesterMapping[props.semester]}{" "}
          {props.semester === "fall" ? year - 1 : year}
          {isEditable && <span style={{ fontWeight: "normal" }}> - </span>}
        </SemesterText>
        {isEditable && (
          <SemesterType
            year={yearPosition}
            status={status}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event, props.semester)
            }
          />
        )}
      </div>
    </Container>
  );
};

const textContainerStyle: React.CSSProperties = {
  marginLeft: 6,
  marginRight: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord,
    transferCourses: ScheduleCourse[]
  ) =>
    dispatch(
      changeSemesterStatusForActivePlanAction(
        newStatus,
        year,
        tappedSemester,
        transferCourses
      )
    ),
});

export const SemesterTop = connect<
  {},
  ReduxDispatchSemesterTopProps,
  SemesterTopProps,
  AppState
>(
  null,
  mapDispatchToProps
)(SemesterTopComponent);
