import * as React from "react";
import styled from "styled-components";
import { DNDSchedule } from "../models/types";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@material-ui/icons/ExpandLessOutlined";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopInfo = styled.div`
  display: flex;
  height: 70px;
  background-color: #fafafa;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const BottomInfo = styled.div`
  display: flex;
  height: 200px;
  background-color: #fafafa;
`;

export interface IDropDownModalProps {
  schedule: DNDSchedule;
}

export interface IDropDownModalState {
  expanded: boolean;
}

export class DropDownModal extends React.Component<
  IDropDownModalProps,
  IDropDownModalState
> {
  constructor(props: IDropDownModalProps) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <Wrapper>
        <TopInfo onClick={this.handleClick.bind(this)}>
          <p>4 courses</p>
          <p>16 credits</p>
          <p>Freshman Standing</p>
          {this.state.expanded ? (
            <ExpandLessOutlinedIcon />
          ) : (
            <ExpandMoreOutlinedIcon />
          )}
        </TopInfo>
        {this.state.expanded && <BottomInfo></BottomInfo>}
      </Wrapper>
    );
  }
}
