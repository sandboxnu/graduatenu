import * as React from "react";
import styled from "styled-components";
import { YearTop, YearBottom } from ".";
import { SemesterBlock } from "../";
import {
  DNDSchedule,
  ScheduleCourse,
  Status,
  SeasonWord,
  CourseWarning,
  DNDScheduleTerm,
} from "../../models/types";
import { SEMESTER_MIN_HEIGHT } from "../../constants";
import { convertTermIdToSeason } from "../../utils";

export interface IYearProps {
  index: number;
  schedule: DNDSchedule;
  handleAddClasses: (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm
  ) => void;
  handleStatusChange: (
    newStatus: Status,
    tappedSemester: SeasonWord,
    year: number
  ) => void;
  courseWarnings: CourseWarning[];
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
  addClassesWrapper = (semester: DNDScheduleTerm) => {
    return (courses: ScheduleCourse[]) =>
      this.props.handleAddClasses(courses, semester);
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
              schedule.yearMap[year].fall
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "fall"
            )}
          />
          <SemesterBlock
            semester={schedule.yearMap[year].spring}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].spring
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "spring"
            )}
          />
          <SemesterBlock
            semester={schedule.yearMap[year].summer1}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].summer1
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "summer1"
            )}
          />
          <SemesterBlock
            semester={schedule.yearMap[year].summer2}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].summer2
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "summer2"
            )}
          />
        </YearBody>
        <YearBottom schedule={schedule} year={year} />
      </div>
    );
  }
}
