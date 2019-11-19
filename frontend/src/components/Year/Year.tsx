import * as React from "react";
import styled from "styled-components";
import { YearTop } from "./YearTop";
import SemesterBlock from "../SemesterBlock";
import {
  DNDSchedule,
  NamedScheduleCourse,
  Status,
  SeasonWord,
} from "../../models/types";
import { YearBottom } from "./YearBottom";
import { SEMESTER_MIN_HEIGHT } from "../../constants";

export interface IYearProps {
  index: number;
  schedule: DNDSchedule;
  handleAddClasses: (courses: NamedScheduleCourse[], termId: number) => void;
  handleStatusChange: (
    newStatus: Status,
    tappedSemester: SeasonWord,
    year: number
  ) => void;
}

const YearText = styled.h3`
  margin-bottom: 8px;
`;

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
`;

export class Year extends React.Component<IYearProps> {
  addClassesWrapper = (termId: number) => {
    return (courses: NamedScheduleCourse[]) =>
      this.props.handleAddClasses(courses, termId);
  };

  render() {
    const { index, schedule } = this.props;
    const year = schedule.years[index];
    return (
      <div style={{ marginBottom: 12 }}>
        <YearText>{year + " - " + (year + 1)}</YearText>
        <YearTop
          handleStatusChange={(newStatus: Status, tappedSemester: SeasonWord) =>
            this.props.handleStatusChange(newStatus, tappedSemester, year)
          }
        />
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
        <YearBottom schedule={schedule} year={year}></YearBottom>
      </div>
    );
  }
}
