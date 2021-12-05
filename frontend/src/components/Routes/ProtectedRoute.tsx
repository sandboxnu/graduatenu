import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

export function ProtectedRoute({
  component,
  path,
}: {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  path: string;
}) {
  // const { userId } = useSelector(
  //   (state: AppState) => ({
  //     userId: getUserIdFromState(state),
  //   }),
  //   shallowEqual
  // );

  // TODO: Figure out how auth token works
  // if (getAuthToken()) {
  //   // if user exists in redux
  //   if (userId) {
  return <Route path={path} component={component} />;
  //   } else {
  //     return <RedirectScreen redirectUrl={path} />;
  //   }
  // } else {
  //   return <Redirect to="/" />;
  // }
}
