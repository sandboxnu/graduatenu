import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../services/UserService";
import {
  setFullNameAction,
  setUserIdAction,
  setDeclaredMajorAction,
  setUserCoopCycleAction,
  setEmailAction,
  setIsAdvisorAction,
  setGraduationYearAction,
  setAcademicYearAction,
} from "../state/actions/userActions";
import {
  setCompletedCourses,
  setTransferCourses,
} from "../state/actions/scheduleActions";
import { AppState } from "../state/reducers/state";
import { findMajorFromName } from "../utils/plan-helpers";
import {
  getAcademicYearFromState,
  getGraduationYearFromState,
  getIsAdvisorFromState,
} from "../state";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";
import { AUTH_TOKEN_COOKIE_KEY } from "../utils/auth-helpers";
import { getScheduleCoursesFromSimplifiedCourseDataAPI } from "../utils/course-helpers";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import ErrorIcon from "@material-ui/icons/Error";

const Centered = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Text = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
`;
const SubText = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 2px;
  color: gray;
  a {
    color: red;
    text-decoration: none;
  }
`;

interface Props {
  redirectUrl?: string;
}

export const RedirectScreen: React.FC<Props> = ({ redirectUrl }) => {
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
      const cookie = Cookies.get(AUTH_TOKEN_COOKIE_KEY);
      if (cookie) {
        Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
          path: "/redirect",
          domain: window.location.hostname,
        });
        // remove cookie if it already exists
        Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
          path: "/",
          domain: window.location.hostname,
        });
        Cookies.set(AUTH_TOKEN_COOKIE_KEY, cookie, {
          path: "/",
          domain: window.location.hostname,
        }); // set persisting cookie for all paths
        fetchUser(cookie)
          .then(response => {
            dispatch(setFullNameAction(response.user.username));
            dispatch(setGraduationYearAction(response.user.graduationYear));
            dispatch(setAcademicYearAction(response.user.academicYear));
            const maj = findMajorFromName(response.user.major, majors);
            if (maj) {
              dispatch(setDeclaredMajorAction(maj));
            }
            dispatch(setUserIdAction(response.user.id));
            dispatch(setEmailAction(response.user.email));
            dispatch(setUserCoopCycleAction(response.user.coopCycle));
            dispatch(setIsAdvisorAction(response.user.isAdvisor));
            Promise.all([
              getScheduleCoursesFromSimplifiedCourseDataAPI(
                response.user.coursesCompleted
              ).then(courses => {
                dispatch(setCompletedCourses(courses));
              }),
              getScheduleCoursesFromSimplifiedCourseDataAPI(
                response.user.coursesTransfer
              ).then(courses => {
                dispatch(setTransferCourses(courses));
              }),
            ]).then(_ => setIsLoading(false));
          })
          .catch(e => console.log(e));
      }
    });
  }, []);

  const needsToGoToOnboarding = () => {
    return !graduationYear || !academicYear;
  };

  if (!Cookies.get(AUTH_TOKEN_COOKIE_KEY)) {
    return (
      <Centered>
        <ErrorIcon color="secondary" style={{ fontSize: 80 }} />
        <Text> Oh oh, we couldn't authenticate you! </Text>
        <SubText>
          Reach out to your advisor or to us{" "}
          <a href="mailto: graduate@sandboxnu.com">here</a>
        </SubText>
      </Centered>
    );
  }

  if (isLoading) {
    return (
      <Centered>
        <CircularProgress color="secondary" />
        <Text> Getting GraduateNU ready </Text>
        <SubText> Don't worry, it'll take just a second </SubText>
      </Centered>
    );
  }

  if (redirectUrl && redirectUrl !== "/redirect") {
    return <Redirect to={redirectUrl} />;
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
