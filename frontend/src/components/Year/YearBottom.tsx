import * as React from "react";
import styled from "styled-components";
import { DNDSchedule } from "../../models/types";
import { CLASS_BLOCK_WIDTH, GraduateGrey } from "../../constants";
import { sumCreditsInSemester } from "../../utils/schedule-helpers";

interface YearBottomProps {
  schedule: DNDSchedule;
  year: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100;
  background-color: ${GraduateGrey};
  border: 1px solid black;
`;

export const YearBottom: React.SFC<YearBottomProps> = ({ schedule, year }) => {
  return (
    <Container>
      <div style={divStyle}>
        <p style={pStyle as any}>
          {sumCreditsInSemester(schedule, year, "fall")}
        </p>
      </div>
      <div style={divStyle}>
        <p style={pStyle as any}>
          {sumCreditsInSemester(schedule, year, "spring")}
        </p>
      </div>
      <div style={divStyle}>
        <p style={pStyle as any}>
          {sumCreditsInSemester(schedule, year, "summer1")}
        </p>
      </div>
      <div style={divStyle}>
        <p style={pStyle as any}>
          {sumCreditsInSemester(schedule, year, "summer2")}
        </p>
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
