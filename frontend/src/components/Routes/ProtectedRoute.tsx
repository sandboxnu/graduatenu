import React from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth-helpers";

export function ProtectedRoute({
  component,
  path,
}: {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  path: string;
}) {
  if (isLoggedIn()) {
    return <Route path={path} component={component} />;
  } else {
    return <Redirect to="/" />;
  }
}
