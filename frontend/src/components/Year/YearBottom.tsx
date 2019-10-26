import * as React from "react";
import styled from "styled-components";
import { Schedule } from "../../models/types";
import { CLASS_BLOCK_WIDTH } from "../../constants";

interface YearBottomProps {
  schedule: Schedule;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100;
  background-color: #dbdbdb;
  border: 1px solid black;
`;

export const YearBottom: React.SFC<YearBottomProps> = props => {
  return (
    <Container>
      <div style={divStyle}>
        <p style={pStyle as any}>00</p>
      </div>
      <div style={divStyle}>
        <p style={pStyle as any}>00</p>
      </div>
      <div style={divStyle}>
        <p style={pStyle as any}>00</p>
      </div>
      <div style={divStyle}>
        <p style={pStyle as any}>00</p>
      </div>
    </Container>
  );
};

const divStyle = {
  width: CLASS_BLOCK_WIDTH - 8,
  paddingLeft: 6,
  paddingRight: 6,
};

const pStyle = {
  textAlign: "right",
};
