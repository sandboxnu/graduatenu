import * as React from "react";
import styled from "styled-components";
import { DNDSchedule } from "../models/types";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

const TopInfo = styled.div`
  display: flex;
  flex: 1;
  height: 65px;
  background-color: #fafafa;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const BottomInfo = styled.div`
  display: flex;
  flex: 1;
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

  render() {
    return (
      <Wrapper>
        <TopInfo>
          <p>4 courses</p>
          <p>16 credits</p>
          <p>Freshman Standing</p>
        </TopInfo>
        {this.state.expanded && <BottomInfo></BottomInfo>}
      </Wrapper>
    );
  }
}
