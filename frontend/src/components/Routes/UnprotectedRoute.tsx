import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { RedirectScreen } from "../../Onboarding/RedirectScreen";
import { getAuthToken } from "../../utils/auth-helpers";

export function UnprotectedRoute({
  component,
  path,
}: {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  path: string;
}) {
  if (getAuthToken()) {
    return <Route path={path} component={RedirectScreen} />;
  } else {
    return <Route path={path} component={component} />;
  }
}
