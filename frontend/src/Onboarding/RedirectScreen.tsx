import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import { fetchActiveUser } from "../services/UserService";
import {
  setUserAction,
  setCompletedCoursesAction,
  setTransferCoursesAction,
} from "../state/actions/userActions";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";
import { AUTH_TOKEN_COOKIE_KEY } from "../utils/auth-helpers";
import { getScheduleCoursesFromSimplifiedCourseDataAPI } from "../utils/course-helpers";
import { LoadingScreen } from "../components/common/FullPageLoading";
import { setAdvisorAction } from "../state/actions/advisorActions";

interface Props {
  redirectUrl?: string;
}

export const RedirectScreen: React.FC<Props> = ({ redirectUrl }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvisor, setIsAdvisor] = useState<boolean | undefined>();
  const [isError, setIsError] = useState(false);
  const [needsToGoToOnboarding, setNeedsToGoToOnboarding] = useState<
    boolean | undefined
  >();

  // component did mount
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
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
        fetchActiveUser(cookie)
          .then(response => {
            setIsAdvisor(response.user.isAdvisor);
            if (!response.user.isAdvisor) {
              // student

              dispatch(setUserAction(response.user));
              Promise.all([
                getScheduleCoursesFromSimplifiedCourseDataAPI(
                  response.user.coursesCompleted
                ).then(courses => {
                  dispatch(setCompletedCoursesAction(courses));
                }),
                getScheduleCoursesFromSimplifiedCourseDataAPI(
                  response.user.coursesTransfer
                ).then(courses => {
                  dispatch(setTransferCoursesAction(courses));
                }),
              ]).then(() => {
                setNeedsToGoToOnboarding(
                  !response.user.graduationYear || !response.user.academicYear
                );
                setIsLoading(false); // this update must come last, to make sure other state variables are correctly set before we redirect
              });
            } else {
              dispatch(setAdvisorAction(response.user));
              setIsLoading(false);
            }
          })
          .catch(e => {
            // TODO: Log error to some service like rollbar
            console.log(e);
            setIsError(true);
          });
      }
    });
  }, []);

  if (!Cookies.get(AUTH_TOKEN_COOKIE_KEY) || isError) {
    return <LoadingScreen errorMsg="Oh oh, we couldn't authenticate you!" />;
  }

  if (isLoading) {
    return (
      <LoadingScreen
        text="Authenticating you"
        subText="Don't worry, it'll take just a second"
      />
    );
  }

  if (redirectUrl && redirectUrl !== "/redirect") {
    return <Redirect to={redirectUrl} />;
  }

  if (isAdvisor === false) {
    // student
    if (needsToGoToOnboarding) {
      return <Redirect to="/onboarding" />;
    } else {
      return <Redirect to="/home" />;
    }
  } else {
    // advisor
    return <Redirect to="/advisor/notifications" />;
  }
};
