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
import {
  getUserMajorFromState,
  getCompletedRequirementsFromState,
} from "../state";
import {
  setCompletedCoursesAction,
  setTransferCoursesAction,
} from "../state/actions/studentActions";
import styled from "styled-components";
import { fetchCourse } from "../api";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  SelectableCourse,
  OnboardingSelectionTemplate,
} from "./GenericOnboarding";
import { Grid, Paper } from "@material-ui/core";
import { AddClassSearchModal } from "../components/AddClassSearchModal";
import { AddBlock } from "../components/ClassBlocks/AddBlock";

const TitleText = styled.div`
  font-size: 12px;
  margin-left: 4px;
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
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
  setTransferCourses: (transferCourses: ScheduleCourse[]) => void;
}

type Props = TransferCoursesScreenProps & RouteComponentProps;

interface State {
  selectedRequirements: IRequiredCourse[];
  completedNonTransfer: IRequiredCourse[];
  modalVisible: boolean;
  otherCourses: IRequiredCourse[][];
}

class TransferCoursesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      modalVisible: false,
      selectedRequirements: [],
      otherCourses: [],
      completedNonTransfer: props.completedRequirements,
    };
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  showModal() {
    this.setState({ modalVisible: true });
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

  /**
   * Separate transfer and non transfer courses, convert non transfer completed courses
   * into ScheduleCourses, and populate redux store.
   */
  async onSubmit() {
    let completedNonTransfer = this.state.completedNonTransfer.filter(
      req => !this.state.selectedRequirements.includes(req)
    );
    let completed: ScheduleCourse[] = [];

    for (let course of completedNonTransfer) {
      const scheduleCourse = await fetchCourse(
        course.subject,
        String(course.classId)
      );

      if (scheduleCourse) {
        completed.push(scheduleCourse);
      }
    }

    let selectedCourses: ScheduleCourse[] = [];
    for (let course of this.state.selectedRequirements) {
      const scheduleCourse = await fetchCourse(
        course.subject,
        String(course.classId)
      );

      if (scheduleCourse) {
        selectedCourses.push(scheduleCourse);
      }
    }

    this.props.setCompletedCourses(completed);
    this.props.setTransferCourses(selectedCourses);
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
      this.setState({
        selectedRequirements: [...this.state.selectedRequirements, course],
      });
    } else {
      let reqs = this.state.selectedRequirements.filter(r => r !== course);
      this.setState({
        selectedRequirements: reqs,
      });
    }
  }

  /**
   * Renders course requirements in the list that are in the completed requirements list
   * @param reqs - requirements to be rendered
   */
  parseCourseRequirements(reqs: IRequiredCourse[][]) {
    return reqs
      .filter(req =>
        this.props.completedRequirements.some(
          listReq =>
            listReq.classId === req[0].classId &&
            listReq.subject === req[0].subject
        )
      )
      .map((r: IRequiredCourse[]) => this.renderCourse(r));
  }

  /**
   * renders an entire requirement section if it has  classes specified
   * with the title of the section
   * Only classes that have already been selected as a completed course will be rendered
   * @param requirementGroup - the requirement group to be rendered
   */
  renderSection(requirementGroup: string) {
    const reqs = this.props.major.requirementGroupMap[requirementGroup];
    if (!reqs || reqs.type === "RANGE") {
      return null;
    }
    const renderedReqs = this.parseCourseRequirements(
      flatten(reqs.requirements)
    );
    const returnDiv = (
      <div key={requirementGroup}>
        <TitleText>{requirementGroup}</TitleText>
        {renderedReqs}
      </div>
    );
    return renderedReqs.length > 0 ? returnDiv : null;
  }

  // renders the "Other Course" section with a button to display the add coursese modal and
  // displays all already added courses under the button.
  renderOtherCourseSection() {
    return (
      <div key="other courses">
        <TitleText>Other Courses</TitleText>
        <AddBlock onClick={this.showModal.bind(this)} />
        {this.state.otherCourses.map(this.renderCourse.bind(this))}
      </div>
    );
  }

  /**
   * Renders one course/courseset (if it contains labs/recitiations, and seperated)
   * @param courses - Course pairings to be rendered
   */
  renderCourse(courses: IRequiredCourse[]) {
    let allCourse = courses.map(course => course.subject + course.classId);
    return (
      <SelectableCourse
        courseText={allCourse.join(" and ")}
        onChange={e => courses.forEach(course => this.onChecked(e, course))}
      ></SelectableCourse>
    );
  }

  render() {
    let renderedMajorReqs = this.props.major.requirementGroups
      .map(r => this.renderSection(r))
      .filter(r => r !== null);
    let split = Math.ceil(renderedMajorReqs.length / 2);
    return (
      <OnboardingSelectionTemplate
        screen={2}
        mainTitleText={"Select any courses you took as transfer credit:"}
        onSubmit={this.onSubmit.bind(this)}
        to={"transferableCredits"}
      >
        <Grid container justify="space-evenly">
          <Grid key={0} item>
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {renderedMajorReqs.slice(0, split)}
            </Paper>
          </Grid>
          <Grid key={1} item>
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {this.renderOtherCourseSection()}
              {renderedMajorReqs.slice(split, renderedMajorReqs.length)}
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
  completedRequirements: getCompletedRequirementsFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCompletedCourses: (completedCourses: ScheduleCourse[]) =>
    dispatch(setCompletedCoursesAction(completedCourses)),
  setTransferCourses: (transferCourses: ScheduleCourse[]) =>
    dispatch(setTransferCoursesAction(transferCourses)),
});

export const TransferCoursesScreen = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TransferCoursesComponent)
);
