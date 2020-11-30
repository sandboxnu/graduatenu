import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../services/UserService";
import {
  setFullNameAction,
  setTokenAction,
  setUserIdAction,
  setDeclaredMajorAction,
  setUserCoopCycleAction,
  setEmailAction,
  setIsAdvisorAction,
} from "../state/actions/userActions";
import { AppState } from "../state/reducers/state";
import { findMajorFromName } from "../utils/plan-helpers";
import {
  getAcademicYearFromState,
  getGraduationYearFromState,
  getIsAdvisorFromState,
} from "../state";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";

const cookies = new Cookies();

export const RedirectScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { academicYear, graduationYear, isAdvisor } = useSelector(
    (state: AppState) => ({
      academicYear: getAcademicYearFromState(state),
      graduationYear: getGraduationYearFromState(state),
      isAdvisor: getIsAdvisorFromState(state),
    })
  );

  // component did mount
  useEffect(() => {
    fetchMajorsAndPlans()(dispatch).then(majors => {
      const cookie = cookies.get("auth_token");
      cookies.remove("auth_token", {
        path: "/redirect",
        domain: window.location.hostname,
      });
      cookies.set("auth_token", cookie, {
        path: "/",
        domain: window.location.hostname,
      }); // set persisting cookie for all paths
      if (cookie) {
        fetchUser(cookie).then(response => {
          dispatch(setFullNameAction(response.user.username));
          const maj = findMajorFromName(response.user.major, majors);
          if (maj) {
            dispatch(setDeclaredMajorAction(maj));
          }
          dispatch(setTokenAction(response.user.token)); // set auth token
          dispatch(setUserIdAction(response.user.id));
          dispatch(setEmailAction(response.user.email));
          dispatch(setUserCoopCycleAction(response.user.coopCycle));
          dispatch(setIsAdvisorAction(response.user.isAdvisor));
        });
      }
    });
  }, []);

  const needsToGoToOnboarding = () => {
    return !graduationYear || !academicYear;
  };

  if (!cookies.get("auth_token")) {
    return <div>No auth token cookie</div>;
  }

  if (isAdvisor == null || isAdvisor == undefined) {
    return <div>Loading...</div>;
  }

  if (isAdvisor === false) {
    // student
    if (needsToGoToOnboarding()) {
      return <Redirect to="/onboarding" />;
    } else {
      return <Redirect to="/home" />;
    }
  } else {
    // advisor
    return <Redirect to="/advisor/notifications" />;
  }
};
