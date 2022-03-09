import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { Route, RouteComponentProps } from "react-router-dom";
import { RedirectScreen } from "../../Onboarding/RedirectScreen";
import { getAuthToken } from "../../utils/auth-helpers";
import { AppState } from "../../state/reducers/state";

export function ProtectedRoute({
  component,
  path,
}: {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  path: string;
}) {
  const userId = useSelector(
    (state: AppState) => state.studentState?.student?.id
  );

  if (getAuthToken()) {
    if (userId) {
      return <Route path={path} component={component} />;
    } else {
      return <RedirectScreen redirectUrl={path} />;
    }
  }
  return <Redirect to="/" />;
}
