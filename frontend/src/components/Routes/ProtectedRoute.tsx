import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { RedirectScreen } from "../../Onboarding/RedirectScreen";
import {
  getDoesUserExistInState,
  safelyGetIsAdvisorFromState,
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
  const { userExists, isAdvisor } = useSelector(
    (state: AppState) => ({
      userExists: getDoesUserExistInState(state),
      isAdvisor: safelyGetIsAdvisorFromState(state),
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
      return <Route path={path} component={component} />;
    } else {
      return <RedirectScreen redirectUrl={path} />;
    }
  } else {
    return <Redirect to="/" />;
  }
}
