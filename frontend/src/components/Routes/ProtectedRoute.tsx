import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { RedirectScreen } from "../../Onboarding/RedirectScreen";
import {
  safelyGetAcademicYearFromState,
  safelyGetGraduationYearFromState,
  getDoesAdvisorExistInState,
  getDoesStudentExistInState,
} from "../../state";
import { AppState } from "../../state/reducers/state";
import { authCookieExists } from "../../utils/auth-helpers";

export function ProtectedRoute({
  component,
  path,
}: {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  path: string;
}) {
  const { userExists, isAdvisor, finishedOnboarding } = useSelector(
    (state: AppState) => ({
      userExists:
        getDoesAdvisorExistInState(state) || getDoesStudentExistInState(state),
      isAdvisor: getDoesAdvisorExistInState(state),
      finishedOnboarding:
        !!safelyGetGraduationYearFromState(state) &&
        !!safelyGetAcademicYearFromState(state),
    }),
    shallowEqual
  );

  if (authCookieExists()) {
    // if user exists in redux
    if (userExists) {
      if (
        (isAdvisor && !path.includes("advisor")) ||
        (!isAdvisor && path.includes("advisor"))
      ) {
        // advisor is trying to go to student routes
        // or student is trying to go to advisor routes
        return <Redirect to="/" />;
      }

      if (finishedOnboarding && path.includes("onboarding")) {
        // leave out completed/transfer courses screens for now
        return <Redirect to="/home" />;
      }

      return <Route path={path} component={component} />;
    } else {
      return <RedirectScreen redirectUrl={path} />;
    }
  } else {
    return <Redirect to="/" />;
  }
}
