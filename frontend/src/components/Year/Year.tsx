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
  DNDScheduleCourse,
  DNDScheduleTerm,
} from "../../models/types";
import { SEMESTER_MIN_HEIGHT } from "../../constants";
import { convertTermIdToSeason } from "../../utils";

export interface IYearProps {
  index: number;
  schedule: DNDSchedule;
  handleAddClasses: (courses: ScheduleCourse[], termId: number) => void;
  handleStatusChange: (
    newStatus: Status,
    tappedSemester: SeasonWord,
    year: number
  ) => void;
  courseWarnings: CourseWarning[];
  onDeleteClass: (semester: DNDScheduleTerm, course: DNDScheduleCourse) => void;
}

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
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
        <YearTop
          handleStatusChange={(newStatus: Status, tappedSemester: SeasonWord) =>
            this.props.handleStatusChange(newStatus, tappedSemester, year)
          }
          year={year}
        />
        <YearBody>
          <SemesterBlock
            semester={schedule.yearMap[year].fall}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].fall.termId
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "fall"
            )}
            onDeleteClass={(course: DNDScheduleCourse) =>
              this.props.onDeleteClass(schedule.yearMap[year].fall, course)
            }
          />
          <SemesterBlock
            semester={schedule.yearMap[year].spring}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].spring.termId
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "spring"
            )}
            onDeleteClass={(course: DNDScheduleCourse) =>
              this.props.onDeleteClass(schedule.yearMap[year].spring, course)
            }
          />
          <SemesterBlock
            semester={schedule.yearMap[year].summer1}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].summer1.termId
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "summer1"
            )}
            onDeleteClass={(course: DNDScheduleCourse) =>
              this.props.onDeleteClass(schedule.yearMap[year].summer1, course)
            }
          />
          <SemesterBlock
            semester={schedule.yearMap[year].summer2}
            handleAddClasses={this.addClassesWrapper(
              schedule.yearMap[year].summer2.termId
            )}
            courseWarnings={this.props.courseWarnings.filter(
              w => convertTermIdToSeason(w.termId) === "summer2"
            )}
            onDeleteClass={(course: DNDScheduleCourse) =>
              this.props.onDeleteClass(schedule.yearMap[year].summer2, course)
            }
          />
        </YearBody>
        <YearBottom schedule={schedule} year={year} />
      </div>
    );
  }
}
