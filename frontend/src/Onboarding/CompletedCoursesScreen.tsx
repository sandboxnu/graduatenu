import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { Dispatch } from "redux";
import { ScheduleCourse, Major } from "../models/types";
import { getMajorFromState } from "../state";
import { addCompletedCourses } from "../state/actions/scheduleActions";

interface Props {
  major?: Major;
}

interface State {
  selectedCourses: ScheduleCourse[];
}

export class CompletedCoursesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCourses: [],
    };
  }

  render() {
    return (
      <GenericQuestionTemplate question="Which classes have you taken?">
        <div></div>
      </GenericQuestionTemplate>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  major: getMajorFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCompletedCourses: (completedCourses: ScheduleCourse[]) =>
    dispatch(addCompletedCourses(completedCourses)),
});

export const CompletedCoursesScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedCoursesComponent);
