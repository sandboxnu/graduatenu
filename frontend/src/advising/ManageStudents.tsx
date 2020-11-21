import React from "react";
import { GenericAdvisingTemplateComponent } from "./GenericAdvisingTemplate";
import { Dispatch } from "redux";
import { AppState } from "../state/reducers/state";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

const ManageStudentsComponent: React.FC = (props: any) => {
  return <div></div>;
};

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const ManageStudents = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ManageStudentsComponent));
