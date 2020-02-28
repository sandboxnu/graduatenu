import * as React from "react";
import styled from "styled-components";
import { ThreeDots } from "../common";
import { Menu, MenuItem } from "@material-ui/core";
import { SeasonWord, Status } from "../../models/types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { changeSemesterStatusAction } from "../../state/actions/scheduleActions";
import { AppState } from "../../state/reducers/state";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 36px;
  background-color: #eb5757;
  border: 1px solid #eb5757;
  box-sizing: border-box;
  margin-top: 16px;
`;

const SemesterText = styled.p`
  text-align: left;
  font-weight: 500;
  font-size: 16px;
  color: white;
`;

interface YearTopProps {
  year: number;
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
  anchorEl: Element | null;
  tappedSemester: SeasonWord | null;
}

class YearTopComponent extends React.Component<Props, YearTopState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      anchorEl: null,
      tappedSemester: null,
    };
  }

  handleClick = (event: any, tappedSemester: SeasonWord) => {
    this.setState({
      anchorEl: event.currentTarget,
      tappedSemester: tappedSemester,
    });
  };

  handleClose = async (newStatus: Status) => {
    const tappedSemester = this.state.tappedSemester;
    await this.setState({ anchorEl: null, tappedSemester: null });
    this.props.handleStatusChange(newStatus, this.props.year, tappedSemester!);
  };

  render() {
    const { year } = this.props;
    return (
      <Container>
        <div style={textContainerStyle}>
          <SemesterText>Fall {year}</SemesterText>
          <ThreeDots
            onClick={(event: any) => this.handleClick(event, "fall")}
          ></ThreeDots>
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Spring {year + 1}</SemesterText>
          <ThreeDots
            onClick={(event: any) => this.handleClick(event, "spring")}
          ></ThreeDots>
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Summer I {year + 1}</SemesterText>
          <ThreeDots
            onClick={(event: any) => this.handleClick(event, "summer1")}
          ></ThreeDots>
        </div>
        <div style={textContainerStyle}>
          <SemesterText>Summer II {year + 1}</SemesterText>
          <ThreeDots
            onClick={(event: any) => this.handleClick(event, "summer2")}
          ></ThreeDots>
        </div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={() =>
            this.setState({
              anchorEl: null,
            })
          }
        >
          <MenuItem onClick={() => this.handleClose("CLASSES")}>
            Set as Classes
          </MenuItem>
          <MenuItem onClick={() => this.handleClose("COOP")}>
            Set as Co-op
          </MenuItem>
          <MenuItem onClick={() => this.handleClose("INACTIVE")}>
            Set as Vacation
          </MenuItem>
        </Menu>
      </Container>
    );
  }
}

const textContainerStyle: React.CSSProperties = {
  marginLeft: 6,
  marginRight: 0,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
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
