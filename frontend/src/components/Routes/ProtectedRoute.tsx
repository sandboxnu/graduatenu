import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { RedirectScreen } from "../../Onboarding/RedirectScreen";
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
    return <Route path={path} component={RedirectScreen} />;
    // TODO: change to <Redirect to="admin site url" /> once khoury implements login
  }
}
