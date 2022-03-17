import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { IRequiredCourse, Major, ScheduleCourse } from "@graduate/common";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  SelectableCourse,
  CourseText,
  OnboardingSelectionTemplate,
  TitleText,
} from "./GenericOnboarding";
import { AddBlock } from "../components/ClassBlocks/AddBlock";
import { Collapse, Grid, Link as ButtonLink, Paper } from "@material-ui/core";
import { setCompletedRequirementsAction } from "../state/actions/studentActions";
import { getUserMajorFromState } from "../state";
import { AddClassSearchModal } from "../components/AddClassSearchModal";
import {
  courseEq,
  coursesToString,
  courseToString,
  flatten,
} from "../utils/course-helpers";

interface CompletedCoursesScreenProps {
  major: Major;
  setCompletedRequirements: (completedRequirements: IRequiredCourse[]) => void;
}

type Props = CompletedCoursesScreenProps & RouteComponentProps;

interface State {
  expandedSections: Map<String, Boolean>;
  modalVisible: boolean;
  otherCourses: IRequiredCourse[][];
  completedRequirements: IRequiredCourse[];
}

class CompletedCoursesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let expanded = new Map<String, Boolean>();
    this.props.major.requirementGroups.forEach((reqGroups) =>
      expanded.set(reqGroups, false)
    );
    expanded.set("Other Courses", true);

    this.state = {
      expandedSections: expanded,
      modalVisible: false,
      otherCourses: [],
      completedRequirements: [],
    };
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  // not actually async, but we need this method to return a Promise
  async onSubmit() {
    this.props.setCompletedRequirements(this.state.completedRequirements);
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
    const requirements = this.state.completedRequirements;
    const filtered = requirements.filter(
      (r) => !courses.some((c) => courseEq(r, c))
    );
    return (
      <SelectableCourse
        key={coursesToString(courses)}
        checked={filtered.length !== requirements.length}
        courseText={courses.map(courseToString).join(" and ")}
        onChange={(e) => {
          this.setState({
            completedRequirements: e.target.checked
              ? [...requirements, ...courses]
              : filtered,
          });
        }}
      />
    );
  }

  // Renders all course requirements in the list
  parseCourseRequirements(reqs: IRequiredCourse[][]) {
    return reqs.map((r: IRequiredCourse[]) => this.renderCourse(r));
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
        to={"/transferCourses"}
      >
        <Grid container justify="space-evenly">
          <Grid key={0} item>
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {this.props.major.requirementGroups
                .slice(0, split)
                .map((r) => this.renderSection(r))}
            </Paper>
          </Grid>
          <Grid key={1} item>
            {this.renderOtherCourseSection()}
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {this.props.major.requirementGroups
                .slice(split, reqLen)
                .map((r) => this.renderSection(r))}
            </Paper>
          </Grid>
        </Grid>
        <AddClassSearchModal
          visible={this.state.modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={(courses: ScheduleCourse[]) =>
            this.addOtherCourses(courses)
          }
        />
      </OnboardingSelectionTemplate>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  major: getUserMajorFromState(state)!,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCompletedRequirements: (completedReqs: IRequiredCourse[]) =>
    dispatch(setCompletedRequirementsAction(completedReqs)),
});

export const CompletedCoursesScreen = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompletedCoursesComponent)
);
