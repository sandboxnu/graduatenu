import * as React from "react";
import styled from "styled-components";
import { MenuItem } from "@material-ui/core";
import { SeasonWord, Status } from "graduate-common";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { changeSemesterStatusAction } from "../../state/actions/scheduleActions";
import { AppState } from "../../state/reducers/state";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

const SemesterType = withStyles(theme => ({
  root: {
    color: "white",
    marginTop: "2px",
    marginLeft: "4px",
  },
  icon: {
    color: "white",
    marginTop: "1px",
  },
}))(Select);

const SemesterTypeInput = withStyles(theme => ({
  root: {
    color: "#FFFFFF",
  },
  input: {
    color: "#FFFFFF",
    position: "relative",
    fontSize: 16,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 36px;
  background-color: #eb5757;
  border: 1px solid #eb5757;
  box-sizing: border-box;
  margin-top: 0px;
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

interface ReduxDispatchYearTopProps {
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => void;
}

type Props = YearTopProps & ReduxDispatchYearTopProps;

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
    const { year } = this.props;
    return (
      <Container>
        <div style={textContainerStyle}>
          <SemesterText>
            Fall {year}
            <span style={{ fontWeight: "normal" }}> - </span>
          </SemesterText>
          <SemesterType
            id="simple-menu"
            value={this.state.fallStatus}
            input={<SemesterTypeInput />}
            onChange={(event: any) => this.handleChange(event, "fall")}
          >
            <MenuItem value={"CLASSES"}>Classes</MenuItem>
            <MenuItem value={"COOP"}>Co-op</MenuItem>
            <MenuItem value={"INACTIVE"}>Vacation</MenuItem>
          </SemesterType>
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Spring {year + 1} - </SemesterText>
          <SemesterType
            id="simple-menu"
            value={this.state.springStatus}
            input={<SemesterTypeInput />}
            onChange={(event: any) => this.handleChange(event, "spring")}
          >
            <MenuItem value={"CLASSES"}>Classes</MenuItem>
            <MenuItem value={"COOP"}>Co-op</MenuItem>
            <MenuItem value={"INACTIVE"}>Vacation</MenuItem>
          </SemesterType>
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Summer I {year + 1} - </SemesterText>
          <SemesterType
            id="simple-menu"
            value={this.state.summer1Status}
            input={<SemesterTypeInput />}
            onChange={(event: any) => this.handleChange(event, "summer1")}
          >
            <MenuItem value={"CLASSES"}>Classes</MenuItem>
            <MenuItem value={"COOP"}>Co-op</MenuItem>
            <MenuItem value={"INACTIVE"}>Vacation</MenuItem>
          </SemesterType>
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Summer II {year + 1} - </SemesterText>
          <SemesterType
            id="simple-menu"
            value={this.state.summer2Status}
            input={<SemesterTypeInput />}
            onChange={(event: any) => this.handleChange(event, "summer2")}
          >
            <MenuItem value={"CLASSES"}>Classes</MenuItem>
            <MenuItem value={"COOP"}>Co-op</MenuItem>
            <MenuItem value={"INACTIVE"}>Vacation</MenuItem>
          </SemesterType>
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => dispatch(changeSemesterStatusAction(newStatus, year, tappedSemester)),
});

export const YearTop = connect<
  {},
  ReduxDispatchYearTopProps,
  YearTopProps,
  AppState
>(
  null,
  mapDispatchToProps
)(YearTopComponent);
