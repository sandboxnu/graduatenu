import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { RedirectScreen } from "../../Onboarding/RedirectScreen";
import { getDoesUserExistInState } from "../../state";
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
  const { userExists } = useSelector(
    (state: AppState) => ({
      userExists: getDoesUserExistInState(state),
    }),
    shallowEqual
  );

  if (authCookieExists()) {
    // if user exists in redux
    if (userExists) {
      return <Route path={path} component={component} />;
    } else {
      return <RedirectScreen redirectUrl={path} />;
    }
  } else {
    return <Redirect to="/" />;
  }
}
