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
  getMajors,
  getMajorsLoadingFlag,
} from "../state";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";

const cookies = new Cookies();

export const RedirectScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {
    majors,
    isFetchingMajors,
    academicYear,
    graduationYear,
    isAdvisor,
  } = useSelector((state: AppState) => ({
    majors: getMajors(state),
    isFetchingMajors: getMajorsLoadingFlag(state),
    academicYear: getAcademicYearFromState(state),
    graduationYear: getGraduationYearFromState(state),
    isAdvisor: getIsAdvisorFromState(state),
  }));

  // component did mount
  useEffect(() => {
    fetchMajorsAndPlans()(dispatch);
  }, []);

  useEffect(() => {
    if (!!isFetchingMajors && majors.length > 0) {
      const cookie = cookies.get("auth_token");
      cookies.set("auth_token", cookie); // set persisting cookie
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
    }
  }, [isFetchingMajors]);

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
