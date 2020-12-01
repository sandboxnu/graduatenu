import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
  setGraduationYearAction,
  setAcademicYearAction,
} from "../state/actions/userActions";
import { AppState } from "../state/reducers/state";
import { findMajorFromName } from "../utils/plan-helpers";
import {
  getAcademicYearFromState,
  getGraduationYearFromState,
  getIsAdvisorFromState,
} from "../state";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";

export const RedirectScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { academicYear, graduationYear, isAdvisor } = useSelector(
    (state: AppState) => ({
      academicYear: getAcademicYearFromState(state),
      graduationYear: getGraduationYearFromState(state),
      isAdvisor: getIsAdvisorFromState(state),
    })
  );
  const [isLoading, setIsLoading] = useState(true);

  // component did mount
  useEffect(() => {
    setIsLoading(true);
    fetchMajorsAndPlans()(dispatch).then(majors => {
      const cookie = Cookies.get("auth_token");
      if (cookie) {
        Cookies.remove("auth_token", {
          path: "/redirect",
          domain: window.location.hostname,
        });
        // remove cookie if it already exists
        Cookies.remove("auth_token", {
          path: "/",
          domain: window.location.hostname,
        });
        Cookies.set("auth_token", cookie, {
          path: "/",
          domain: window.location.hostname,
        }); // set persisting cookie for all paths

        fetchUser(cookie).then(response => {
          dispatch(setFullNameAction(response.user.username));
          dispatch(setGraduationYearAction(response.user.graduationYear));
          dispatch(setAcademicYearAction(response.user.academicYear));
          const maj = findMajorFromName(response.user.major, majors);
          if (maj) {
            dispatch(setDeclaredMajorAction(maj));
          }
          dispatch(setTokenAction(response.user.token)); // set auth token
          dispatch(setUserIdAction(response.user.id));
          dispatch(setEmailAction(response.user.email));
          dispatch(setUserCoopCycleAction(response.user.coopCycle));
          dispatch(setIsAdvisorAction(response.user.isAdvisor));
          setIsLoading(false);
        });
      }
    });
  }, []);

  const needsToGoToOnboarding = () => {
    return !graduationYear || !academicYear;
  };

  if (!Cookies.get("auth_token")) {
    return <div>No auth token cookie</div>;
  }

  if (isLoading) {
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
