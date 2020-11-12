import * as React from "react";
import styled from "styled-components";
import { SeasonWord, Status } from "../../../../common/types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { changeSemesterStatusAction } from "../../state/actions/scheduleActions";
import { AppState } from "../../state/reducers/state";
import { SemesterType } from "./SemesterType";
import { getScheduleFromState } from "../../state";
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
`;

const SemesterText = styled.p`
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  color: white;
`;

interface YearTopProps {
  year: number;
  fallStatus: Status;
  springStatus: Status;
  summer1Status: Status;
  summer2Status: Status;
}

interface ReduxStoreYearTopProps {
  schedule: DNDSchedule;
}

interface ReduxDispatchYearTopProps {
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => void;
}

type Props = YearTopProps & ReduxStoreYearTopProps & ReduxDispatchYearTopProps;

interface YearTopState {
  tappedSemester: SeasonWord | null;
  fallStatus: Status;
  springStatus: Status;
  summer1Status: Status;
  summer2Status: Status;
}

class YearTopComponent extends React.Component<Props, YearTopState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tappedSemester: null,
      fallStatus: this.props.fallStatus,
      springStatus: this.props.springStatus,
      summer1Status: this.props.summer1Status,
      summer2Status: this.props.summer2Status,
    };
  }

  /**
   * Updates this year's semester status labels when a change is made in a parent component.
   * Removes HOVER from status for displaying purposes.
   * @param nextProps the next set of props to be received.
   */
  componentWillReceiveProps(nextProps: Props) {
    let nextFall: Status = nextProps.fallStatus;
    let nextSpring: Status = nextProps.springStatus;
    let nextSummer1: Status = nextProps.summer1Status;
    let nextSummer2: Status = nextProps.summer2Status;

    if (nextFall === "HOVERCOOP" || nextFall === "HOVERINACTIVE") {
      nextFall = nextFall.replace("HOVER", "") as Status;
    }
    if (nextSpring === "HOVERCOOP" || nextSpring === "HOVERINACTIVE") {
      nextSpring = nextSpring.replace("HOVER", "") as Status;
    }
    if (nextSummer1 === "HOVERCOOP" || nextSummer1 === "HOVERINACTIVE") {
      nextSummer1 = nextSummer1.replace("HOVER", "") as Status;
    }
    if (nextSummer2 === "HOVERCOOP" || nextSummer2 === "HOVERINACTIVE") {
      nextSummer2 = nextSummer2.replace("HOVER", "") as Status;
    }

    this.setState({
      fallStatus: nextFall,
      springStatus: nextSpring,
      summer1Status: nextSummer1,
      summer2Status: nextSummer2,
    });
  }

  /**
   * Triggers when a semester status is changed.
   * Updates this component's label state and dispatches the status change to the schedule.
   */
  handleChange = (event: any, tappedSemester: SeasonWord | null) => {
    const curStatus: Status = event.target.value;

    if (tappedSemester === "fall") {
      this.setState({
        fallStatus: curStatus,
      });
    } else if (tappedSemester === "spring") {
      this.setState({
        springStatus: curStatus,
      });
    } else if (tappedSemester === "summer1") {
      this.setState({
        summer1Status: curStatus,
      });
    } else if (tappedSemester === "summer2") {
      this.setState({
        summer2Status: curStatus,
      });
    }
    this.props.handleStatusChange(curStatus, this.props.year, tappedSemester!);
  };

  render() {
    const { year, schedule } = this.props;
    const yearPosition = getPositionOfYearInSchedule(schedule, year);
    return (
      <Container>
        <div style={textContainerStyle}>
          <SemesterText>
            Fall {year}
            <span style={{ fontWeight: "normal" }}> - </span>
          </SemesterText>
          <SemesterType
            year={yearPosition}
            status={this.state.fallStatus}
            onChange={(event: any) => this.handleChange(event, "fall")}
          />
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Spring {year + 1} - </SemesterText>
          <SemesterType
            year={yearPosition}
            status={this.state.springStatus}
            onChange={(event: any) => this.handleChange(event, "spring")}
          />
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Summer I {year + 1} - </SemesterText>
          <SemesterType
            year={yearPosition}
            status={this.state.summer1Status}
            onChange={(event: any) => this.handleChange(event, "summer1")}
          />
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Summer II {year + 1} - </SemesterText>
          <SemesterType
            year={yearPosition}
            status={this.state.summer2Status}
            onChange={(event: any) => this.handleChange(event, "summer2")}
          />
        </div>
      </Container>
    );
  }
}

const textContainerStyle: React.CSSProperties = {
  marginLeft: 6,
  marginRight: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
};

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => dispatch(changeSemesterStatusAction(newStatus, year, tappedSemester)),
});

export const YearTop = connect<
  ReduxStoreYearTopProps,
  ReduxDispatchYearTopProps,
  YearTopProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(YearTopComponent);
