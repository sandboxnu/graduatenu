import * as React from "react";
import styled from "styled-components";
import { YearTop } from "./YearTop";
import SemesterBlock from "../SemesterBlock";
import { Schedule } from "../../models/types";
import { YearBottom } from "./YearBottom";

export interface IYearProps {
  index: number;
  schedule: Schedule;
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
    return (
      <div style={{ marginBottom: 12 }}>
        <YearText>Year {index + 1}</YearText>
        <YearTop />
        <YearBody>
          <SemesterBlock semester={schedule.yearMap[index + 1].fall} />
          <SemesterBlock semester={schedule.yearMap[index + 1].spring} />
          <SemesterBlock semester={schedule.yearMap[index + 1].summer1} />
          <SemesterBlock semester={schedule.yearMap[index + 1].summer2} />
        </YearBody>
        <YearBottom schedule={schedule}></YearBottom>
      </div>
    );
  }
}
