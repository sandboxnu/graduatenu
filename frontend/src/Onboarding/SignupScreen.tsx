import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { AppState } from "../state/reducers/state";
import { Major } from "graduate-common";
import {  IUserData } from "../models/types";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { registerUser } from "../services/UserService";
import { Dispatch } from "redux";
import { setTokenAction } from "../state/actions/userActions";

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

const Box = styled.div`
  border: 1px solid white;
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

interface ReduxStoreSignupScreenProps {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  major?: Major;
  planStr?: string;
}

interface ReduxDispatchSignupScreenProps {
  setToken: (token: string) => void;
}

type Props = ReduxStoreSignupScreenProps &
  ReduxDispatchSignupScreenProps &
  RouteComponentProps<{}>;

interface SignupScreenState {
  emailStr: string;
  passwordStr: string;
  confirmPasswordStr: string;
  beenEditedEmail: boolean;
  beenEditedPassword: boolean;
  beenEditedConfirmPassword: boolean;
  validEmail: boolean;
  errorEmail?: string;
  validPassword: boolean;
  validConfirm: boolean;
}

class SignupScreenComponent extends React.Component<Props, SignupScreenState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      emailStr: "",
      passwordStr: "",
      confirmPasswordStr: "",
      beenEditedEmail: false,
      beenEditedPassword: false,
      beenEditedConfirmPassword: false,
      validEmail: true,
      errorEmail: undefined,
      validPassword: true,
      validConfirm: true,
    };
  }

  /**
   * All of the different functions that modify the stored TextField values as they are changed.
   */

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      emailStr: e.target.value,
      beenEditedEmail: true,
    });
  }

  onChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      passwordStr: e.target.value,
      beenEditedPassword: true,
    });
  }

  onChangeConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      confirmPasswordStr: e.target.value,
      beenEditedConfirmPassword: true,
    });
  }

  /**
   * Validates user input, then sends a sign up request to the backend using the input data.
   * Checks response for error messages, then redirects user to /home if the sign up succeeds.
   */
  submit() {
    // Regex to determine if email string is a valid address
    const validEmail: boolean = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      this.state.emailStr
    );
    const validPassword: boolean = this.state.passwordStr.length >= 6;
    const validConfirm: boolean =
      this.state.passwordStr === this.state.confirmPasswordStr;

    this.setState({
      validEmail,
      validPassword,
      validConfirm,
    });

    if (validEmail && validPassword && validConfirm) {
      const user: IUserData = {
        email: this.state.emailStr,
        password: this.state.passwordStr,
        username: this.props.fullName,
        academic_year: this.props.academicYear,
        graduation_year: this.props.graduationYear,
        major: this.props.major?.name,
        coop_cycle: this.props.planStr,
      };
      registerUser(user).then(response => {
        if (!!response.errors) {
          this.setState({
            errorEmail: response.errors.email,
          });
        } else {
          this.props.setToken(response.user.token);
          this.props.history.push("/home");
        }
      });
    }
  }

  /**
   * Renders the email text field
   */
  renderEmailTextField(textFieldStr: string, beenEdited: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangeEmail.bind(this)}
        placeholder="presidentaoun@northeastern.edu"
        error={
          (textFieldStr.length === 0 && beenEdited) ||
          !this.state.validEmail ||
          !!this.state.errorEmail
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
          minWidth: 326,
        }}
        helperText={
          (this.state.errorEmail && "Email has already been registered") ||
          (!this.state.validEmail && "Please enter a valid email") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid email")
        }
        type="email"
      />
    );
  }

  /**
   * Renders the password text field
   */
  renderPasswordTextField(textFieldStr: string, beenEdited: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangePassword.bind(this)}
        error={
          (textFieldStr.length === 0 && beenEdited) ||
          !this.state.validPassword ||
          !this.state.validConfirm
        }
        style={{
          marginBottom: 16,
          minWidth: 326,
        }}
        helperText={
          (!this.state.validPassword &&
            "Password must be at least 6 characters") ||
          (!this.state.validConfirm && "Passwords do not match") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid password")
        }
        type="password"
      />
    );
  }

  /**
   * Renders the confirm password text field
   */
  renderConfirmPasswordTextField(textFieldStr: string, beenEdited: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Confirm Password"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangeConfirmPassword.bind(this)}
        error={
          (textFieldStr.length === 0 && beenEdited) || !this.state.validConfirm
        }
        style={{
          minWidth: 326,
        }}
        helperText={
          (!this.state.validConfirm && "Passwords do not match") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid password")
        }
        type="password"
      />
    );
  }

  render() {
    return (
      <Wrapper>
        <Title>Sign Up</Title>
        <Box>
          {this.renderEmailTextField(
            this.state.emailStr,
            this.state.beenEditedEmail
          )}
          {this.renderPasswordTextField(
            this.state.passwordStr,
            this.state.beenEditedPassword
          )}
          {this.renderConfirmPasswordTextField(
            this.state.confirmPasswordStr,
            this.state.beenEditedConfirmPassword
          )}
        </Box>

        <Subtitle>
          Already a member? Log in{" "}
          <Link style={{ color: "#EB5757" }} to="/login">
            here
          </Link>{" "}
          or{" "}
          <Link style={{ color: "#EB5757" }} to="/home">
            continue as guest
          </Link>
        </Subtitle>
        <div onClick={this.submit.bind(this)}>
          <PrimaryButton>Sign Up</PrimaryButton>
        </div>
      </Wrapper>
    );
  }
}

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapStateToProps = (state: AppState) => ({
  fullName: state.user.fullName,
  academicYear: state.user.academicYear,
  graduationYear: state.user.graduationYear,
  major: state.user.major,
  planStr: state.user.planStr,
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setToken: (token: string) => dispatch(setTokenAction(token)),
});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SignupScreenComponent));
