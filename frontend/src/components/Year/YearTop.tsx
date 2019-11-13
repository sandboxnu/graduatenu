import * as React from "react";
import styled from "styled-components";
import { CLASS_BLOCK_WIDTH, GraduateGrey } from "../../constants";
import { ThreeDots } from "../common/ThreeDots";

interface YearTopProps {}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100;
  background-color: ${GraduateGrey};
`;

const SemesterText = styled.p`
  text-align: left;
`;

export const YearTop: React.SFC<YearTopProps> = props => {
  return (
    <Container>
      <div style={textContainerStyle}>
        <SemesterText>Fall</SemesterText>
        <ThreeDots onClick={() => void 0}></ThreeDots>
      </div>
      <div style={textContainerStyle}>
        <SemesterText>Spring</SemesterText>
        <ThreeDots onClick={() => void 0}></ThreeDots>
      </div>
      <div style={textContainerStyle}>
        <SemesterText>Summer 1</SemesterText>
        <ThreeDots onClick={() => void 0}></ThreeDots>
      </div>
      <div style={textContainerStyle}>
        <SemesterText>Summer 2</SemesterText>
        <ThreeDots onClick={() => void 0}></ThreeDots>
      </div>
    </Container>
  );
};

const textContainerStyle: React.CSSProperties = {
  width: CLASS_BLOCK_WIDTH - 8,
  marginLeft: 6,
  marginRight: 6,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};
