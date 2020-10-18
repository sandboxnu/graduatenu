import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  ScheduleCourse,
  Major,
  IRequiredCourse,
  Requirement,
} from "../../../common/types";
import { getDeclaredMajorFromState } from "../state";
import { setCompletedCourses } from "../state/actions/scheduleActions";
import { fetchCourse } from "../api";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  CourseText,
  OnboardingSelectionTemplate,
  SelectableCourse,
  TitleText,
} from "./GenericOnboarding";
import { AddBlock } from "../components/ClassBlocks/AddBlock";
import { Link as ButtonLink, Collapse, Grid, Paper } from "@material-ui/core";

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

interface CompletedCoursesScreenProps {
  major: Major;
  setCompletedCourses: (completedCourses: ScheduleCourse[]) => void;
}

type Props = CompletedCoursesScreenProps & RouteComponentProps;

interface State {
  selectedCourses: ScheduleCourse[];
  expandedSections: Map<String, Boolean>;
  modalVisible: boolean;
  otherCourses: IRequiredCourse[][];
}

class CompletedCoursesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let expanded = new Map<String, Boolean>();
    this.props.major.requirementGroups.forEach(reqGroups =>
      expanded.set(reqGroups, false)
    );
    expanded.set("Other Courses", true);

    this.state = {
      selectedCourses: [],
      expandedSections: expanded,
      modalVisible: false,
      otherCourses: [],
    };
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  showModal() {
    this.setState({ modalVisible: true });
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

  // changes the expanding state of the specific section
  onExpand(requirementGroup: string, change: Boolean) {
    this.state.expandedSections.set(requirementGroup, change);
    this.setState({
      expandedSections: this.state.expandedSections,
    });
  }

  // renders the link for show more or show less for the specific requirementGroup, depending on the boolean
  renderShowLink(requirementGroup: string, more: boolean) {
    let more_less_string = more ? "more" : "less";
    return (
      <ButtonLink
        component="button"
        underline="always"
        onClick={() => {
          this.onExpand(requirementGroup, more);
        }}
        style={{ color: "#EB5757" }}
      >
        <CourseText>{"See " + more_less_string + "..."}</CourseText>
      </ButtonLink>
    );
  }

  // Renders one course/courseset (if it contains labs/recitiations, and seperated)
  renderCourse(courses: IRequiredCourse[]) {
    let allCourse = courses.map(course => course.subject + course.classId);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      courses.forEach(course => this.onChecked(e, course));

    return (
      <SelectableCourse
        key={allCourse[0]}
        onChange={onChange}
        courseText={allCourse.join(" and ")}
      />
    );
  }

  // Renders all course requirements in the list
  parseCourseRequirements(reqs: IRequiredCourse[][]) {
    return reqs.map((r: IRequiredCourse[], index: number) => (
      <div key={index}>{this.renderCourse(r)}</div>
    ));
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
        <TitleText>{requirementGroup}</TitleText>
        {this.renderAllCourses(flatten(reqs.requirements), requirementGroup)}
      </div>
    );
  }

  // Renders the courses as either collpasable if it is less than 4 or a standard list of classes
  renderAllCourses(allCourse: IRequiredCourse[][], requirementGroup: string) {
    if (allCourse.length <= 4) {
      return (
        <div key={requirementGroup + " Courses"}>
          {this.parseCourseRequirements(allCourse)}
        </div>
      );
    } else {
      return (
        <div key={requirementGroup + " Courses"}>
          {this.parseCourseRequirements(allCourse.slice(0, 4))}
          <Collapse
            in={!this.state.expandedSections.get(requirementGroup)}
            unmountOnExit
          >
            {this.renderShowLink(requirementGroup, true)}
          </Collapse>
          <Collapse
            in={!!this.state.expandedSections.get(requirementGroup)}
            unmountOnExit
          >
            {this.parseCourseRequirements(allCourse.slice(4, allCourse.length))}
          </Collapse>
        </div>
      );
    }
  }

  // Adds the "other courses" to the state in the form of a IRequiredCourse[][] so that they can be
  // processed by renderAllCourses
  addOtherCourses(courses: ScheduleCourse[]) {
    let reqCourseMap = courses.map((course: ScheduleCourse) => [
      {
        type: "COURSE",
        classId: +course.classId,
        subject: course.subject,
      } as IRequiredCourse,
    ]);
    this.setState({
      otherCourses: [...this.state.otherCourses, ...reqCourseMap],
    });
  }

  // renders the "Other Course" section with a button to display the add coursese modal and
  // displays all already added courses under the button.
  renderOtherCourseSection() {
    return (
      <div key="other courses">
        <TitleText>Other Courses</TitleText>
        <AddBlock onClick={this.showModal.bind(this)} />
        {this.renderAllCourses(this.state.otherCourses, "Other Courses")}
      </div>
    );
  }

  render() {
    let reqLen = this.props.major.requirementGroups.length;
    let split = Math.floor(reqLen / 2);
    return (
      <OnboardingSelectionTemplate
        screen={1}
        mainTitleText={"Completed courses:"}
        onSubmit={this.onSubmit.bind(this)}
        to={"/transferableCredits"}
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
            {this.renderOtherCourseSection()}
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {this.props.major.requirementGroups
                .slice(split, reqLen)
                .map(r => this.renderSection(r))}
            </Paper>
          </Grid>
        </Grid>
      </OnboardingSelectionTemplate>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  major: getDeclaredMajorFromState(state)!,
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
