import * as React from "react";
import styled from "styled-components";
import { YearTop } from "./YearTop";
import SemesterBlock from "../SemesterBlock";
import { ISchedule } from "../../../../backend/src/types";
import { YearBottom } from "./YearBottom";

export interface IYearProps {
  index: number;
  schedule: ISchedule;
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
        <YearTop></YearTop>
        <YearBody>
          <SemesterBlock
            semester={schedule.semesters["semester-" + (1 + 4 * index)]}
          />
          <SemesterBlock
            semester={schedule.semesters["semester-" + (2 + 4 * index)]}
          />
          <SemesterBlock
            semester={schedule.semesters["semester-" + (3 + 4 * index)]}
          />
          <SemesterBlock
            semester={schedule.semesters["semester-" + (4 + 4 * index)]}
          />
        </YearBody>
        <YearBottom schedule={schedule}></YearBottom>
      </div>
    );
  }
}
