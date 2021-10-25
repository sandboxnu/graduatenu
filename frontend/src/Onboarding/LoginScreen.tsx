import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { Major } from "../../../common/types";
import { ILoginData, IUserData, NamedSchedule } from "../models/types";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { Dispatch } from "redux";
import { setStudentAction } from "../state/actions/studentActions";
import { loginUser } from "../services/UserService";
import { AUTH_TOKEN_COOKIE_KEY } from "../utils/auth-helpers";
import Cookies from "js-cookie";
import { AppState } from "../state/reducers/state";
import { SecondaryLinkButton } from "../components/common/LinkButtons";

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
  margin-bottom: 4px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  width: 326px;
  text-align: center;
`;

const Box = styled.div`
  border: 1px solid white;
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  margin-top: 1em;
  display: grid;
  grid-template-columns: auto auto;
  gap: 0em 1em;
`;

interface ReduxStoreLoginScreenProps {
  setAcademicYear: (academicYear: number) => void;
  setGraduationYear: (graduationYear: number) => void;
  setUserCoopCycle: (coopCycle: string) => void;
  setSchedules: (schedules: NamedSchedule[]) => void;
  setPlanStr: (planStr: string) => void;
  setStudent: (student: IUserData) => void;
}
interface ReduxStoreSignupScreenProps {
  majors: Major[];
  setEmail: (email: string) => void;
}

type Props = ReduxStoreLoginScreenProps &
  ReduxStoreSignupScreenProps &
  RouteComponentProps<{}>;

enum ErrorType {
  INVALID_CREDENTIALS,
  OTHER,
}

interface LoginScreenState {
  emailStr: string;
  passwordStr: string;
  beenEditedEmail: boolean;
  beenEditedPassword: boolean;
  validEmail: boolean;
  error?: ErrorType;
}

const LoginScreenComponent: React.FC<Props> = props => {
  const [state, setState] = useState<LoginScreenState>({
    emailStr: "",
    passwordStr: "",
    beenEditedEmail: false,
    beenEditedPassword: false,
    validEmail: true,
    error: undefined,
  });

  /**
   * All of the different functions that modify the stored TextField values as they are changed.
   */
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      emailStr: e.target.value,
      beenEditedEmail: true,
    });
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      passwordStr: e.target.value,
      beenEditedPassword: true,
    });
  };

  /**
   * Validates user input, then sends a log in request to the backend using the input data.
   * Checks response for error messages. If the log in succeeds, dispatch actions to set
   * user attributes obtained from the response object, then redirects user to /home.
   */
  const submit = async () => {
    // Regex to determine if email string is a valid address
    const validEmail: boolean = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      state.emailStr
    );

    setState({
      ...state,
      validEmail,
    });

    if (validEmail) {
      const user: ILoginData = {
        email: state.emailStr,
        password: state.passwordStr,
      };

      try {
        const response = await loginUser(user);

        if (response.data.errors || !response.data.user) {
          // handle response errros
          const isUnauthorized = response.status === 401;

          setState({
            ...state,
            error: isUnauthorized
              ? ErrorType.INVALID_CREDENTIALS
              : ErrorType.OTHER,
          });
        } else {
          // update redux store with logged in user and set cookies
          props.setStudent(response.data.user);
          Cookies.set(AUTH_TOKEN_COOKIE_KEY, response.data.user.token, {
            path: "/",
            domain: window.location.hostname,
          });
          props.history.push("/home");
        }
      } catch (err) {
        // something went wrong making the request
        setState({
          ...state,
          error: ErrorType.OTHER,
        });

        console.log("Something went wrong when logging in: ", err);
      }
    }
  };

  /**
   * Renders the email text field
   */
  const renderEmailTextField = (textFieldStr: string, beenEdited: boolean) => {
    const showInvalidCredsError = state.error === ErrorType.INVALID_CREDENTIALS;

    return (
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={textFieldStr}
        onChange={onChangeEmail}
        placeholder="presidentaoun@northeastern.edu"
        error={
          (textFieldStr.length === 0 && beenEdited) ||
          !state.validEmail ||
          !!state.error
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
          minWidth: 326,
        }}
        helperText={
          (showInvalidCredsError && "Email or password is invalid") ||
          (!state.validEmail && "Please enter a valid email") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid email")
        }
        type="email"
      />
    );
  };

  /**
   * Renders the password text field
   */
  const renderPasswordTextField = (
    textFieldStr: string,
    beenEdited: boolean
  ) => {
    const showInvalidCredsError = state.error === ErrorType.INVALID_CREDENTIALS;

    const showOtherError = state.error === ErrorType.OTHER;

    return (
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={textFieldStr}
        onChange={onChangePassword}
        error={(textFieldStr.length === 0 && beenEdited) || !!state.error}
        style={{
          minWidth: 326,
        }}
        helperText={
          (showInvalidCredsError && "Email or password is invalid") ||
          (showOtherError &&
            "Oops, something went wrong. Please try again later.") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid password")
        }
        type="password"
      />
    );
  };

  // indicates if the user came from login button on welcome page
  const { fromOnBoarding } = (props.location.state as any) || {
    fromOnBoarding: false,
  };

  return (
    <Wrapper>
      <Title>Log In</Title>
      <Box>
        {renderEmailTextField(state.emailStr, state.beenEditedEmail)}
        {renderPasswordTextField(state.passwordStr, state.beenEditedPassword)}
      </Box>

      <Subtitle>
        New here? Sign up{" "}
        <Link
          style={{ color: "#EB5757" }}
          to={{
            pathname: fromOnBoarding ? "/onboarding" : "/signup",
          }}
        >
          here
        </Link>
        {" or "}
        <Link
          style={{ color: "#EB5757" }}
          to={{
            pathname: fromOnBoarding ? "/onboarding" : "/home",
            state: { fromOnBoardingGuest: fromOnBoarding },
          }}
        >
          continue as guest
        </Link>
      </Subtitle>
      <ButtonContainer>
        <PrimaryButton onClick={submit}>Log In</PrimaryButton>
        <SecondaryLinkButton to="/">Back</SecondaryLinkButton>
      </ButtonContainer>
    </Wrapper>
  );
};

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setStudent: (user: IUserData) => dispatch(setStudentAction(user)),
});

/**
 * Callback to be passed into connect, responsible for providing the components
 * with the required redux state.
 * @param state the redux store state.
 */
const mapStateToProps = (_state: AppState) => ({});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginScreenComponent));
