import * as React from "react";
import styled from "styled-components";
import { YearTop } from ".";
import { SemesterBlock } from "../";
import { DNDSchedule } from "../../models/types";
import { SEMESTER_MIN_HEIGHT } from "../../constants";

export interface IYearProps {
  index: number;
  schedule: DNDSchedule;
}

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
`;

export class Year extends React.Component<IYearProps> {
  render() {
    const { index, schedule } = this.props;
    const year = schedule.years[index];
    return (
      <div style={{ width: "100%", marginBottom: 12 }}>
        <YearTop year={year} />
        <YearBody>
          <SemesterBlock semester={schedule.yearMap[year].fall} />
          <SemesterBlock semester={schedule.yearMap[year].spring} />
          <SemesterBlock semester={schedule.yearMap[year].summer1} />
          <SemesterBlock semester={schedule.yearMap[year].summer2} />
        </YearBody>
      </div>
    );
  }
}
