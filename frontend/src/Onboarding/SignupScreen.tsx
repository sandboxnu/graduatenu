import { Form, Formik } from "formik";
import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButton } from "../components/common/PrimaryButton";
import * as Yup from "yup";
import { TextField } from "@material-ui/core";
import { IUpdateUserData, IUpdateUserPassword } from "../models/types";
import { AUTH_TOKEN_COOKIE_KEY, getAuthToken } from "../utils/auth-helpers";
import { registerUser, updatePassword } from "../services/UserService";
import { useHistory } from "react-router";
import { AppState } from "../state/reducers/state";
import Cookies from "js-cookie";
import {
  getAcademicYearFromState,
  getCompletedCoursesFromState,
  getGraduationYearFromState,
  getPlansFromState,
  getUserCatalogYearFromState,
  getUserConcentrationFromState,
  getUserCoopCycleFromState,
  getUserFullNameFromState,
  getUserIdFromState,
  getUserMajorNameFromState,
  safelyGetTransferCoursesFromState,
} from "../state";
import { Schedule, ScheduleCourse } from "../../../common/types";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Title = styled.div`
  margin-top: 96px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Subtitle = styled.div`
  margin-top: 8px;
  margin-bottom: 2px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  width: 326px;
`;

const StyleForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const SignupValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .max(255)
    .required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

interface SignupReduxStoreProps {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  catalogYear: number | null;
  coopCycle: string | null;
  concentration: string | null;
  major: string | null;
  plans: Record<string, Schedule[]>;
  userId: number;
  coursesTransferred: ScheduleCourse[] | [];
  completedCourses: ScheduleCourse;
}

type Props = SignupReduxStoreProps & RouteComponentProps;

const SignupScreenComponent = (props: Props) => {
  const SignupForm = ({
    fullName,
    academicYear,
    graduationYear,
    catalogYear,
    coopCycle,
    concentration,
    major,
    plans,
    userId,
    coursesTransferred,
    completedCourses,
  }: SignupReduxStoreProps) => {
    const history = useHistory();

    const handleSubmit = ({
      email,
      password,
      confirmPassword,
    }: {
      email: string;
      password: string;
      confirmPassword: string;
    }): void => {
      const user: IUpdateUserData = {
        email,
        major,
        full_name: fullName,
        academic_year: academicYear,
        graduation_year: graduationYear,
        coop_cycle: coopCycle,
        concentration,
        catalog_year: catalogYear,
        //    courses_transfer: coursesTransferred,
        //    courses_completed: completedCourses,
      };

      registerUser(user).then(userResponse => {
        if (userResponse.errors) {
          // TODO: Change error handling
          alert("errors");
          console.log("Could not register user!");
        } else {
          const updatedPassword: IUpdateUserPassword = {
            old_password: "",
            new_password: password,
            confirm_password: confirmPassword,
          };

          updatePassword(userResponse.user.token, updatedPassword).then(
            passwordResponse => {
              if (passwordResponse.errors) {
                console.log("Could not update password!");
              }
            }
          );

          Cookies.set(AUTH_TOKEN_COOKIE_KEY, userResponse.user.token, {
            path: "/",
            domain: window.location.hostname,
          });
          history.push("/home");
        }
      });
    };

    return (
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SignupValidation}
        onSubmit={values => {
          handleSubmit({
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          });
        }}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <StyleForm>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={errors.email && touched.email && errors.email}
            />

            <TextField
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={
                errors.password && touched.password && errors.password
              }
            />

            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword &&
                touched.confirmPassword &&
                errors.confirmPassword
              }
            />

            <button type="submit">Submit</button>
          </StyleForm>
        )}
      </Formik>
    );
  };

  return (
    <Wrapper>
      <Title>Sign Up</Title>

      {SignupForm(props)}

      <Subtitle>
        Already a member? Log in{" "}
        <Link
          style={{ color: "#EB5757" }}
          to={{
            pathname: "/login",
          }}
        >
          here
        </Link>
        {" or "}
        <Link style={{ color: "#EB5757" }} to="/home">
          continue as guest
        </Link>
      </Subtitle>
      <div onClick={() => console.log("Hello")}>
        <PrimaryButton>Sign Up</PrimaryButton>
      </div>
    </Wrapper>
  );
};

const mapStateToProps = (state: AppState) => ({
  fullName: getUserFullNameFromState(state),
  academicYear: getAcademicYearFromState(state),
  graduationYear: getGraduationYearFromState(state),
  catalogYear: getUserCatalogYearFromState(state),
  coopCycle: getUserCoopCycleFromState(state),
  concentration: getUserConcentrationFromState(state),
  major: getUserMajorNameFromState(state),
  plans: getPlansFromState(state),
  userId: getUserIdFromState(state),
  coursesTransferred: safelyGetTransferCoursesFromState(state),
  completedCourses: getCompletedCoursesFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SignupScreenComponent));

/**
 * 1. write a function for getCurrentScheduleData -> userplanstate????.plan(state)
 * -> (redux store getter function)
 * 2. fix the type
 * 3. finish up the createPlanForUser
 * 4. Update password -> api call (updatePassword)
 * 5. put possible getters in mapStateToProps: major, fullName, coopcycle, graduation year (basically everything in IUpdate)
 * 6. after finishing createPlanForUser -> response IS A PLAN -> put this shit in redux store
 *   => addNewSchedule (mapDispatch)
 *
 *
 * frontend -> backend call -> get response -> store in reducer ->
 * get from reducer for some purposes -> frontend -> repeat
 *
 */
