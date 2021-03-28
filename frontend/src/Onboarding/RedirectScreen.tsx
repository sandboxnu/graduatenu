import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { batch, useDispatch } from "react-redux";
import { fetchActiveUser } from "../services/UserService";
import {
  setStudentAction,
  setCompletedCoursesAction,
  setTransferCoursesAction,
  setStudentAcademicYearAction,
} from "../state/actions/studentActions";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";
import { authCookieExists, AUTH_TOKEN_COOKIE_KEY } from "../utils/auth-helpers";
import { getScheduleCoursesFromSimplifiedCourseDataAPI } from "../utils/course-helpers";
import { LoadingScreen } from "../components/common/FullPageLoading";
import { setAdvisorAction } from "../state/actions/advisorActions";
import { ScheduleCourse } from "../../../common/types";

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

  const calculateAndSetAcademicYear = (completedCourses: ScheduleCourse[]) => {
    // sort the courses from the earliest to lastest semester
    if (completedCourses && completedCourses.length != 0) {
      const sortedCourses = JSON.parse(JSON.stringify(completedCourses)).sort(
        (first: ScheduleCourse, second: ScheduleCourse) => {
          if (Number(first.semester!) < Number(second.semester!)) {
            return -1;
          } else if (Number(second.semester!) < Number(first.semester!)) {
            return 1;
          } else {
            return 0;
          }
        }
      );

      const earliestSemesterYear = sortedCourses[0].semester?.substring(0, 4);
      const latestSemesterYear = sortedCourses[
        sortedCourses.length - 1
      ].semester?.substring(0, 4);
      const academicYear =
        Number(latestSemesterYear) - Number(earliestSemesterYear) + 1;
      return academicYear;
    } else {
      return 1;
    }
  };

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

              dispatch(setStudentAction(response.user));
              Promise.all([
                getScheduleCoursesFromSimplifiedCourseDataAPI(
                  response.user.coursesCompleted
                ).then(courses => {
                  batch(() => {
                    dispatch(setCompletedCoursesAction(courses));
                    dispatch(
                      setStudentAcademicYearAction(
                        calculateAndSetAcademicYear(courses)
                      )
                    );
                  });
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

  if ((authCookieExists() && isError) || !authCookieExists()) {
    // jwt token expired or does not exist
    // remove cookie if it already exists
    Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
      path: "/",
      domain: window.location.hostname,
    });
    return <Redirect to="/" />;
  }

  if (isError) {
    return <LoadingScreen errorMsg="Oh oh, we couldn't authenticate you!" />;
  }

  if (isLoading) {
    return <LoadingScreen text="Authenticating you" />;
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
    return <Redirect to="/advisor/appointments" />;
  }
};
