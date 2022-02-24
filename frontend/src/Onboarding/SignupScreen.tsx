import { Form, Formik } from "formik";
import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButton } from "../components/common/PrimaryButton";
import * as Yup from "yup";
import { TextField } from "@material-ui/core";
import { IUserData } from "../models/types";
import { useHistory } from "react-router";
import { setStudentAction } from "../state/actions/studentActions";
import { loginUser, registerUser } from "../services/UserService";
import { setAuthTokenAsCookie } from "../utils/auth-helpers";
import { AppState } from "../state/reducers/state";
import { getMajorsFromState, getMajorsLoadingFlagFromState } from "../state";
import { Major } from "../../../common/types";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SecondaryLinkButton } from "../components/common/LinkButtons";
import { createInitialStudent } from "../utils/student-helpers";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Title = styled.div`
  margin: 96px 0 48px 0;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Subtitle = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
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

const ButtonContainer = styled.div`
  align-self: center;
  margin-top: 1em;
  display: grid;
  grid-template-columns: auto auto;
  gap: 0em 1em;
`;

const SignupValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(6, "Must be at least 6 characters")
    .max(255)
    .required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const marginBottomSpace = 12;

interface SignupReduxStoreProps {
  setStudentAction: (student: IUserData) => void;
  isFetchingMajors: boolean;
  majors: Major[];
}

type Props = SignupReduxStoreProps & RouteComponentProps<{}>;

const SignupScreenComponent: React.FC<Props> = ({
  setStudentAction,
  majors,
  isFetchingMajors,
}) => {
  const history = useHistory();

  if (majors.length === 0) {
    if (isFetchingMajors) {
      return <LoadingSpinner />;
    } else {
      history.push("/");
    }
  }

  const SignupForm: React.FC = () => {
    const handleSubmit = async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      // TODO: finish this part after aryan's stuff gets merged to create a student
      const res = await registerUser({
        email,
        password,
      });
      if (res.errors == null) {
        const { status, data } = await loginUser({
          email,
          password,
        });

        if (status === 200 && data.user != null) {
          const { token, ...otherInfo } = data.user;
          setAuthTokenAsCookie(token);
          const initialStudent = createInitialStudent(
            otherInfo.id,
            otherInfo.email
          );
          setStudentAction(initialStudent);
          history.push("/onboarding");
        }
      }
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
          });
        }}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <StyleForm>
            <TextField
              style={{ marginBottom: marginBottomSpace }}
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
              style={{ marginBottom: marginBottomSpace }}
              id="password"
              name="password"
              label="Password"
              type="password"
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
              style={{ marginBottom: marginBottomSpace }}
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
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
            <ButtonContainer>
              <PrimaryButton type="submit">Sign up</PrimaryButton>
              <SecondaryLinkButton to="/">Back</SecondaryLinkButton>
            </ButtonContainer>
          </StyleForm>
        )}
      </Formik>
    );
  };

  return (
    <Wrapper>
      <Title>Sign Up</Title>
      {<SignupForm />}
    </Wrapper>
  );
};

const mapStateToProps = (state: AppState) => ({
  majors: getMajorsFromState(state),
  isFetchingMajors: getMajorsLoadingFlagFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setStudentAction: (student: IUserData) => dispatch(setStudentAction(student)),
});

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SignupScreenComponent));
