import * as React from "react";
import styled from "styled-components";
import { YearTop } from "./YearTop";
import SemesterBlock from "../SemesterBlock";
import { DNDSchedule } from "../../models/types";
import { YearBottom } from "./YearBottom";

export interface IYearProps {
  index: number;
  schedule: DNDSchedule;
}

const YearText = styled.h3`
  margin-bottom: 8px;
`;

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
`;

export class Year extends React.Component<IYearProps> {
  render() {
    const { index, schedule } = this.props;
    const year = schedule.years[index];
    return (
      <div style={{ marginBottom: 12 }}>
        <YearText>{year}</YearText>
        <YearTop />
        <YearBody>
          <SemesterBlock semester={schedule.yearMap[year].fall} />
          <SemesterBlock semester={schedule.yearMap[year].spring} />
          <SemesterBlock semester={schedule.yearMap[year].summer1} />
          <SemesterBlock semester={schedule.yearMap[year].summer2} />
        </YearBody>
        <YearBottom schedule={schedule}></YearBottom>
      </div>
    );
  }
}
