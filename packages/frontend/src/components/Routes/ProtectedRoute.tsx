import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { Route } from "react-router-dom";
// import { RedirectScreen } from "../../Onboarding/RedirectScreen";
import { getAuthToken } from "../../utils/auth-helpers";
import { AppState } from "../../state/reducers/state";

export function ProtectedRoute({
  component,
  path,
}: {
  component: React.ComponentType<any>;
  path: string;
}) {
  const userId = useSelector(
    (state: AppState) => state.studentState?.student?.id
  );

  if (getAuthToken()) {
    if (userId) {
      return <Route path={path} element={component} />;
    } else {
      return <Navigate to={path} />;
    }
  }
  return <Navigate to="/" />;
}

export const RequireAuth: React.FC = () => {
  const userId = useSelector(
    (state: AppState) => state.studentState?.student?.id
  );

  if (getAuthToken() && userId) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};
