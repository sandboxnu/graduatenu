import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  ScheduleCourse,
  Major,
  IRequiredCourse,
  Requirement,
  ICourseRange,
  ISubjectRange,
} from "../models/types";
import { getMajorFromState } from "../state";
import { setCompletedCourses } from "../state/actions/scheduleActions";
import styled from "styled-components";
import { Checkbox } from "@material-ui/core";
import { fetchCourse } from "../api";
import { NextButton } from "../components/common/NextButton";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const Box = styled.div`
  margin-top: 20vh;
  margin-bottom: 20vh;
  border: 1px solid black;
  padding: 18px;
  width: 500px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2``;

const Question = styled.p``;

const TitleText = styled.div`
  margin-left: 4px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const CourseWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CourseText = styled.p`
  font-size: 14px;
  margin: 4px;
`;

const CourseTextNoMargin = styled.p`
  font-size: 14px;
  margin: 0px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const CourseAndLabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 4px;
`;

const ANDORText = styled.p`
  font-size: 11px;
  margin: 4px;
`;

interface CompletedCoursesScreenProps {
  major: Major;
  setCompletedCourses: (completedCourses: ScheduleCourse[]) => void;
}

type Props = CompletedCoursesScreenProps & RouteComponentProps;

interface State {
  selectedCourses: ScheduleCourse[];
}

class CompletedCoursesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCourses: [],
    };
  }

  onSubmit() {
    this.props.setCompletedCourses(this.state.selectedCourses);
  }

  async handleChecked(e: any, course: IRequiredCourse) {
    const checked = e.target.checked;

    if (checked) {
      const scheduleCourse = await fetchCourse(
        course.subject,
        String(course.classId)
      );
      if (scheduleCourse) {
        this.setState({
          selectedCourses: [...this.state.selectedCourses, scheduleCourse],
        });
      }
    } else {
      const courses = this.state.selectedCourses;
      courses.filter(
        c =>
          c.subject !== course.subject && c.classId !== String(course.classId)
      );
      this.setState({
        selectedCourses: courses,
      });
    }
  }

  renderCourse(
    course: IRequiredCourse,
    noMargin: boolean = false,
    checkbox: boolean = true
  ) {
    return (
      <CourseWrapper key={course.subject + course.classId + course.type}>
        {checkbox && (
          <Checkbox
            value="primary"
            color="primary"
            onChange={e => this.handleChecked(e, course)}
          />
        )}
        {noMargin ? (
          <CourseTextNoMargin>
            {course.subject + course.classId}
          </CourseTextNoMargin>
        ) : (
          <CourseText>{course.subject + course.classId}</CourseText>
        )}
      </CourseWrapper>
    );
  }

  handleRange(req: ICourseRange) {
    return (
      <div>
        <ANDORText style={{ marginBottom: 8 }}>
          Complete {req.creditsRequired} credits from the following courses that
          are not already required:
        </ANDORText>
        {req.ranges.map((r: ISubjectRange, index: number) => {
          return (
            <CourseText key={r.subject + r.idRangeStart + " - " + r.idRangeEnd}>
              {r.subject + r.idRangeStart + " through " + r.idRangeEnd}
            </CourseText>
          );
        })}
      </div>
    );
  }

  renderRequirement(req: Requirement, index: number) {
    if (req.type === "COURSE") {
      return this.renderCourse(req as IRequiredCourse);
    }

    if (req.type === "RANGE") {
      return this.handleRange(req as ICourseRange);
    }

    if (
      req.type === "AND" &&
      req.courses.length === 2 &&
      req.courses.filter(c => c.type === "COURSE").length === 2
    ) {
      return (
        <CourseAndLabWrapper key={index}>
          <Checkbox
            value="primary"
            color="primary"
            onChange={e => {
              this.handleChecked(e, req.courses[0] as IRequiredCourse);
              this.handleChecked(e, req.courses[1] as IRequiredCourse);
            }}
          />
          {this.renderCourse(req.courses[0] as IRequiredCourse, true, false)}
          <CourseText> and </CourseText>
          {this.renderCourse(req.courses[1] as IRequiredCourse, true, false)}
        </CourseAndLabWrapper>
      );
    }

    return (
      <div key={index.toString()}>
        {req.courses
          .filter(c => c.type === "COURSE")
          .map(c => this.renderCourse(c as IRequiredCourse))}
        {req.courses
          .filter(c => c.type === "AND")
          .map((c: Requirement, index: number) =>
            this.renderRequirement(c, index)
          )}
        {req.courses
          .filter(c => c.type === "OR")
          .map((c: Requirement, index: number) =>
            this.renderRequirement(c, index)
          )}
      </div>
    );
  }

  parseRequirements(reqs: Requirement[]) {
    return reqs.map((r: Requirement, index: number) => (
      <div key={index}>{this.renderRequirement(r, index)}</div>
    ));
  }

  renderSection(requirementGroup: string) {
    const reqs = this.props.major.requirementGroupMap[requirementGroup];
    if (!reqs) {
      return <div key={requirementGroup} />;
    }

    if (reqs.type === "RANGE") {
      return <div key={requirementGroup} />;
    }

    return (
      <div key={requirementGroup}>
        <TitleText>{requirementGroup}</TitleText>
        {this.parseRequirements(reqs.requirements)}
      </div>
    );
  }

  render() {
    return (
      <Wrapper>
        <Box>
          <Title>Course List</Title>
          <Question>Which classes have you taken?</Question>
          {this.props.major.requirementGroups.map(r => this.renderSection(r))}
          <Link
            to={"/home"}
            onClick={this.onSubmit.bind(this)}
            style={{ textDecoration: "none" }}
          >
            <NextButton />
          </Link>
        </Box>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  major: getMajorFromState(state)!,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCompletedCourses: (completedCourses: ScheduleCourse[]) =>
    dispatch(setCompletedCourses(completedCourses)),
});

export const CompletedCoursesScreen = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CompletedCoursesComponent)
);
