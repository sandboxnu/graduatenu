import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { Major, Schedule } from "graduate-common";
import { ILoginData } from "../models/types"
import { PrimaryButton } from "../components/common/PrimaryButton";
import { Dispatch } from "redux";
import {
  setFullNameAction,
  setMajorAction,
  setAcademicYearAction,
  setGraduationYearAction,
  setTokenAction,
  setIdAction,
  setEmailAction
} from "../state/actions/userActions";
import { setCoopCycle } from "../state/actions/scheduleActions";
import { loginUser } from "../services/UserService";

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

interface ReduxStoreLoginScreenProps {
  setFullName: (fullName: string) => void;
  setAcademicYear: (academicYear: number) => void;
  setGraduationYear: (graduationYear: number) => void;
  setMajor: (major?: Major) => void;
  setCoopCycle: (plan: Schedule) => void;
  setToken: (token: string) => void;
  setId: (id: number) => void;
  setEmail: (email: string) => void;
}

type Props = ReduxStoreLoginScreenProps & RouteComponentProps<{}>;

interface LoginScreenState {
  emailStr: string;
  passwordStr: string;
  beenEditedEmail: boolean;
  beenEditedPassword: boolean;
  validEmail: boolean;
  error?: string;
}

class LoginScreenComponent extends React.Component<Props, LoginScreenState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      emailStr: "",
      passwordStr: "",
      beenEditedEmail: false,
      beenEditedPassword: false,
      validEmail: true,
      error: undefined,
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

  /**
   * Validates user input, then sends a log in request to the backend using the input data.
   * Checks response for error messages. If the log in succeeds, dispatch actions to set
   * user attributes obtained from the response object, then redirects user to /home.
   */
  submit() {
    // Regex to determine if email string is a valid address
    const validEmail: boolean = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      this.state.emailStr
    );

    this.setState({
      validEmail,
    });

    if (validEmail) {
      const user: ILoginData = {
        email: this.state.emailStr,
        password: this.state.passwordStr,
      };

      loginUser(user).then(response => {
        if (response.errors) {
          this.setState({
            error: "invalid",
          });
        } else {
          console.log(response);
          this.props.setFullName(response.user.username);
          this.props.setAcademicYear(response.user.academicYear);
          this.props.setGraduationYear(response.user.graduationYear);
          this.props.setToken(response.user.token);
          this.props.setId(response.user.id);
          this.props.setEmail(response.user.email);
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
          !!this.state.error
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
          minWidth: 326,
        }}
        helperText={
          (this.state.error && "Email or password is invalid") ||
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
        error={(textFieldStr.length === 0 && beenEdited) || !!this.state.error}
        style={{
          minWidth: 326,
        }}
        helperText={
          (this.state.error && "Email or password is invalid") ||
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
        <Title>Log In</Title>
        <Box>
          {this.renderEmailTextField(
            this.state.emailStr,
            this.state.beenEditedEmail
          )}
          {this.renderPasswordTextField(
            this.state.passwordStr,
            this.state.beenEditedPassword
          )}
        </Box>

        <Subtitle>
          New here? Sign up{" "}
          <Link style={{ color: "#EB5757" }} to="/signup">
            here
          </Link>{" "}
          or{" "}
          <Link style={{ color: "#EB5757" }} to="/home">
            continue as guest
          </Link>
        </Subtitle>
        <div onClick={this.submit.bind(this)}>
          <PrimaryButton>Log In</PrimaryButton>
        </div>
      </Wrapper>
    );
  }
}

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFullName: (fullName: string) => dispatch(setFullNameAction(fullName)),
  setAcademicYear: (academicYear: number) =>
    dispatch(setAcademicYearAction(academicYear)),
  setGraduationYear: (academicYear: number) =>
    dispatch(setGraduationYearAction(academicYear)),
  setMajor: (major?: Major) => dispatch(setMajorAction(major)),
  setCoopCycle: (plan: Schedule) => dispatch(setCoopCycle(plan)),
  setToken: (token: string) => dispatch(setTokenAction(token)),
  setId: (id: number) => dispatch(setIdAction(id)),
  setEmail: (email: string) => dispatch(setEmailAction(email))
});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const LoginScreen = connect(
  null,
  mapDispatchToProps
)(withRouter(LoginScreenComponent));
