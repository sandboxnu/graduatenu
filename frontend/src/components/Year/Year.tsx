import * as React from "react";
import styled from "styled-components";
import { YearTop } from "./YearTop";
import SemesterBlock from "../SemesterBlock";
import { DNDSchedule, ScheduleCourse } from "../../models/types";
import { YearBottom } from "./YearBottom";

export interface IYearProps {
  index: number;
  schedule: DNDSchedule;
  handleAddClasses: (courses: ScheduleCourse[], termId: number) => void;
}

const YearText = styled.h3`
  margin-bottom: 8px;
`;

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
`;

export class Year extends React.Component<IYearProps> {
  addClassesWrapper = (termId: number) => {
    return (courses: ScheduleCourse[]) =>
      this.props.handleAddClasses(courses, termId);
  };

  render() {
    const { index, schedule } = this.props;
    const year = schedule.years[index];
    return (
      <div style={{ marginBottom: 12 }}>
        <YearText>{year + " - " + (year + 1)}</YearText>
        <YearTop />
        <YearBody>
          <SemesterBlock
            semester={schedule.yearMap[year].fall}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].fall.termId
            )}
          />
          <SemesterBlock
            semester={schedule.yearMap[year].spring}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].spring.termId
            )}
          />
          <SemesterBlock
            semester={schedule.yearMap[year].summer1}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].summer1.termId
            )}
          />
          <SemesterBlock
            semester={schedule.yearMap[year].summer2}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].summer2.termId
            )}
          />
        </YearBody>
        <YearBottom schedule={schedule}></YearBottom>
      </div>
    );
  }
}
