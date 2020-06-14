import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  ScheduleCourse,
  Major,
  IRequiredCourse,
  Requirement,
} from "graduate-common";
import { getMajorFromState, getCompletedRequirementsFromState } from "../state";
import { setCompletedCourses } from "../state/actions/scheduleActions";
import styled from "styled-components";
import { fetchCourse } from "../api";
import { NextButton } from "../components/common/NextButton";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  Link as ButtonLink,
  Collapse,
  Grid,
  Paper,
  Checkbox,
} from "@material-ui/core";

const MainTitleText = styled.div`
  font-size: 18px;
  margin-left: 4px;
  margin-top: 10px;
  margin-bottom: 12px;
  font-weight: 500;
`;

const TitleText = styled.div`
  font-size: 12px;
  margin-left: 4px;
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const CourseWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CourseText = styled.p`
  font-size: 12px;
  margin: 1px;
  font-weight: 400;
`;

const ScrollWrapper = styled.div`
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    background-color: #c1c1c1;
    border-color: transparent;
    border-radius: 9px 8px 8px 9px;
    border-style: solid;
    border-width: 3px 3px 3px 4px;
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 16px;
  }
  &::-webkit-scrollbar-track:vertical {
    border-left: 1px solid #e7e7e7;
    box-shadow: 1px 0 1px 0 #f6f6f6 inset, -1px 0 1px 0 #f6f6f6 inset;
  }
`;

/**
 * Flattens the Requirement[] into only a list of Requirements/Requirement sets
 * This means that all inner lists will only contain one class or a list of the primary class and its labs/recitations
 * @param reqs
 */
function flatten(reqs: Requirement[]): IRequiredCourse[][] {
  return reqs.map(flattenOne).reduce((array, cur) => array.concat(cur), []);
}

function flattenOne(req: Requirement): IRequiredCourse[][] {
  if (req.type === "COURSE") {
    return [[req as IRequiredCourse]];
  } else if (
    req.type === "AND" &&
    req.courses.filter(c => c.type === "COURSE").length
  ) {
    return [req.courses as IRequiredCourse[]];
  } else if (req.type === "AND" || req.type === "OR") {
    return flatten(req.courses);
  } else {
    return [];
  }
}

interface TransferCoursesScreenProps {
  major: Major;
  completedRequirements: IRequiredCourse[];
  setCompletedCourses: (completedCourses: ScheduleCourse[]) => void;
  transfer?: boolean;
}

type Props = TransferCoursesScreenProps & RouteComponentProps;

interface State {
  selectedCourses: ScheduleCourse[];
}

class TransferCoursesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCourses: [],
    };
  }

  onSubmit() {
    this.props.setCompletedCourses(this.state.selectedCourses);
  }

  /**
   * Handles a class when it has been checked off. If it is being unchecked, it removes it,
   * and if it is being checked, it converts it to a ScheduleCourse and adds it to selected courses
   * @param e
   * @param course
   */
  async onChecked(e: any, course: IRequiredCourse) {
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
      let courses = this.state.selectedCourses.filter(
        c =>
          c.subject !== course.subject && c.classId !== String(course.classId)
      );
      this.setState({
        selectedCourses: courses,
      });
    }
  }

  // Renders a list of completed IRequiredCourses in the transfer course selection screen
  renderCourses(courses: IRequiredCourse[]) {
    return (
      <div>
        {courses.map(course => (
          <CourseWrapper key={course.subject + course.classId}>
            <Checkbox
              style={{ width: 2, height: 2 }}
              icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
              checkedIcon={
                <CheckBoxIcon style={{ fontSize: 20, color: "#EB5757" }} />
              }
              onChange={e =>
                courses.forEach(course => this.onChecked(e, course))
              }
            />
            <CourseText>{course.subject + course.classId}</CourseText>
          </CourseWrapper>
        ))}
      </div>
    );
  }

  // Renders one course/courseset (if it contains labs/recitiations, and seperated)
  renderCourse(courses: IRequiredCourse[]) {
    let allCourse = courses.map(course => course.subject + course.classId);
    return (
      <CourseWrapper key={allCourse[0]}>
        <Checkbox
          style={{ width: 2, height: 2 }}
          icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
          checkedIcon={
            <CheckBoxIcon style={{ fontSize: 20, color: "#EB5757" }} />
          }
          onChange={e => courses.forEach(course => this.onChecked(e, course))}
        />
        <CourseText>{allCourse.join(" and ")}</CourseText>
      </CourseWrapper>
    );
  }

  // Renders all course requirements in the list
  parseCourseRequirements(reqs: IRequiredCourse[][]) {
    console.log(reqs);
    return reqs.map((r: IRequiredCourse[], index: number) => {
      for (let req of r) {
        if (!this.props.completedRequirements.includes(req)) {
          return null;
        } else {
          return <div key={index}>{this.renderCourse(r)}</div>;
        }
      }
    });
  }

  // renders an entire requirement section if it has specific classes specified
  // with the title of the section
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
        {this.renderAllCourses(flatten(reqs.requirements), requirementGroup)}
      </div>
    );
  }

  // Renders the courses as either collpasable if it is less than 4 or a standard list of classes
  renderAllCourses(allCourse: IRequiredCourse[][], requirementGroup: string) {
    return (
      <div key={requirementGroup + " Courses"}>
        {this.parseCourseRequirements(allCourse)}
      </div>
    );
  }

  render() {
    let reqLen = this.props.completedRequirements.length;
    let split = Math.floor(reqLen / 2);
    return (
      <GenericOnboardingTemplate screen={2}>
        <MainTitleText>
          Select any courses you took as transfer credit:
        </MainTitleText>
        <Paper
          elevation={0}
          style={{
            minWidth: 800,
            maxWidth: 800,
            minHeight: 300,
            maxHeight: 300,
            overflow: "-moz-scrollbars-vertical",
            overflowY: "scroll",
          }}
          component={ScrollWrapper}
        >
          <Grid container justify="space-evenly">
            <Grid key={0} item>
              <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
                {this.props.major.requirementGroups
                  .slice(0, split)
                  .map(r => this.renderSection(r))}
              </Paper>
            </Grid>
            <Grid key={1} item>
              <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
                {this.props.major.requirementGroups
                  .slice(split, reqLen)
                  .map(r => this.renderSection(r))}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
        <Link
          to={this.props.transfer ? "/signup" : "/transferCourses"}
          onClick={this.onSubmit.bind(this)}
          style={{ textDecoration: "none" }}
        >
          <NextButton />
        </Link>
      </GenericOnboardingTemplate>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  major: getMajorFromState(state)!,
  completedRequirements: getCompletedRequirementsFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCompletedCourses: (completedCourses: ScheduleCourse[]) =>
    dispatch(setCompletedCourses(completedCourses)),
});

export const TransferCoursesScreen = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferCoursesComponent)
);
