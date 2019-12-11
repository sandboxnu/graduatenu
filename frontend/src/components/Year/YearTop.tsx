import * as React from "react";
import styled from "styled-components";
import { CLASS_BLOCK_WIDTH, GraduateGrey } from "../../constants";
import { ThreeDots } from "../common";
import { Menu, MenuItem } from "@material-ui/core";
import { SeasonWord, Status } from "../../models/types";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100;
  background-color: ${GraduateGrey};
  margin-top: 16px;
`;

const SemesterText = styled.p`
  text-align: left;
`;

interface YearTopProps {
  year: number;
  handleStatusChange: (newStatus: Status, tappedSemester: SeasonWord) => void;
}

interface YearTopState {
  anchorEl: Element | null;
  tappedSemester: SeasonWord | null;
}

export class YearTop extends React.Component<YearTopProps, YearTopState> {
  constructor(props: any) {
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
    this.props.handleStatusChange(newStatus, tappedSemester!);
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
          onClose={this.handleClose}
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
  width: CLASS_BLOCK_WIDTH,
  marginLeft: 6,
  marginRight: 0,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};
