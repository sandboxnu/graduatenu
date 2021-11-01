import { Field, Form, Formik } from "formik";
import React, { Dispatch, Props, useState } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButton } from "../components/common/PrimaryButton";
import * as Yup from "yup";
import { TextField } from "@material-ui/core";
import { ErrorOutlineSharp } from "@material-ui/icons";
import {
  IUpdateUserData,
  IUpdateUserPassword,
  ScheduleSlice,
} from "../models/types";
import { AUTH_TOKEN_COOKIE_KEY, getAuthToken } from "../utils/auth-helpers";
import { registerUser, updatePassword } from "../services/UserService";
import { useHistory } from "react-router";
import { createPlanForUser } from "../services/PlanService";
import { AppState } from "../state/reducers/state";
import Cookies from "js-cookie";
import {
  getAcademicYearFromState,
  getActivePlanScheduleFromState,
  getCompletedCourseCounterFromState,
  getCompletedCourseScheduleFromState,
  getCompletedCoursesFromState,
  getGraduationYearFromState,
  getMajorsFromState,
  getMajorsLoadingFlagFromState,
  getPlansFromState,
  getPlansLoadingFlagFromState,
  getUserCatalogYearFromState,
  getUserFullNameFromState,
  getUserIdFromState,
  getUserMajorNameFromState,
} from "../state";
import {
  setStudentId,
  setStudentIdAction,
} from "../state/actions/studentActions";

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

interface DispatchProps {}

type Props = IUpdateUserData & DispatchProps;

const SignupScreenComponent = (props: any) => {
  const SignupForm = ({
    major,
    full_name,
    academic_year,
    graduation_year,
    coop_cycle,
    concentration,
    catalog_year,
  }: IUpdateUserData) => {
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
        full_name,
        academic_year,
        graduation_year,
        coop_cycle,
        concentration,
        catalog_year,
        // courses_transfer and courses_completed?
      };

      registerUser(user).then(response => {
        if (response.errors) {
          // TODO: Change error handling
          alert("errors");
        } else {
          const scheduleData: ScheduleSlice = props.getCurrentScheduleData();
          createPlanForUser(response.user.id, {
            name: "Plan 1",
            link_sharing_enabled: false,
            schedule: scheduleData.schedule,
            catalog_year: catalog_year,
            major: major ?? "",
            coop_cycle: props.planStr ? props.planStr : "None",
            course_counter: scheduleData.currentClassCounter,
            // warnings: scheduleData.warnings, ICREATEPLAN ???
            // courseWarnings: scheduleData.courseWarnings,
          }).then(plan => {
            props.addNewSchedule(plan.plan.name, plan.plan as ScheduleSlice);
            props.addPlanId(plan.plan.id);
            props.setPlanName(plan.plan.name);
            props.setLinkSharing(plan.plan.link_sharing_enabled);
          });
          props.setUserId(response.user.id);
          props.setEmail(response.user.email);
          props.setUserCoopCycle(response.user.coopCycle);
          Cookies.set(AUTH_TOKEN_COOKIE_KEY, response.user.token, {
            path: "/",
            domain: window.location.hostname,
          });
          history.push("/home");
        }
      });
    };
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
        // const password: IUpdateUserPassword = {
        //   old_password: "",
        //   new_password: values.password,
        //   confirm_password: valu
        // const token = getAuthToken();
        // updatePassword(token, password).then(response => {
        // });
        // es.confirmPassword,
        // };
        // cookies?
        // Go to main plan
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
            helperText={errors.password && touched.password && errors.password}
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
  getCurrentScheduleData: () => getActivePlanScheduleFromState(state),
  fullName: getUserFullNameFromState(state),
  academicYear: getAcademicYearFromState(state),
  graduationYear: getGraduationYearFromState(state),
  catalogYear: getUserCatalogYearFromState(state),
  major: getUserMajorNameFromState(state),
  majors: getMajorsFromState(state),
  plans: getPlansFromState(state),
  isFetchingMajors: getMajorsLoadingFlagFromState(state),
  isFetchingPlans: getPlansLoadingFlagFromState(state),
  userId: getUserIdFromState(state),
  completedCourses: getCompletedCoursesFromState(state),
  completedCourseSchedule: getCompletedCourseScheduleFromState(state),
  completedCourseCounter: getCompletedCourseCounterFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserId: (id: number) => dispatch(setStudentIdAction(id)),
  addPlanId: (planId: number) => dispatch(addPlanIdAction(planId)),
  setPlanName: (name: string) => dispatch(setPlanNameAction(name)),
  addNewSchedule: (name: string, newSchedule: ScheduleSlice) =>
    dispatch(addNewSchedule(name, newSchedule)),

  setLinkSharing: (linkSharing: boolean) =>
    dispatch(setLinkSharingAction(linkSharing)),
  setEmail: (email: string) => dispatch(setEmailAction(email)),
  setUserCoopCycle: (coopCycle: string) =>
    dispatch(setStudentCoopCycleAction(coopCycle)),
});

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
