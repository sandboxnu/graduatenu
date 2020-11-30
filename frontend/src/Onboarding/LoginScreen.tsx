import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { Major } from "../../../common/types";
import { ILoginData, ScheduleSlice, NamedSchedule } from "../models/types";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { Dispatch } from "redux";
import { AppState } from "../state/reducers/state";
import {
  setFullNameAction,
  setMajorPlanAction,
  setAcademicYearAction,
  setGraduationYearAction,
  setTokenAction,
  setUserIdAction,
  setDeclaredMajorAction,
  setEmailAction,
  setUserCoopCycleAction,
} from "../state/actions/userActions";
import { getMajors } from "../state";
import { setSchedules } from "../state/actions/schedulesActions";
import { loginUser } from "../services/UserService";
import { findAllPlansForUser } from "../services/PlanService";
import { findMajorFromName } from "../utils/plan-helpers";

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
  setMajorPlan: (major: Major | undefined, planStr: string) => void;
  setUserCoopCycle: (coopCycle: string) => void;
  setToken: (token: string) => void;
  setUserId: (id: number) => void;
  setSchedules: (schedules: NamedSchedule[]) => void;
  setPlanStr: (planStr: string) => void;
}
interface ReduxStoreSignupScreenProps {
  majors: Major[];
  setEmail: (email: string) => void;
}

type Props = ReduxStoreLoginScreenProps &
  ReduxStoreSignupScreenProps &
  RouteComponentProps<{}>;

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
          this.props.setFullName(response.user.username);
          this.props.setAcademicYear(response.user.academicYear);
          this.props.setGraduationYear(response.user.graduationYear);
          this.props.setToken(response.user.token);
          this.props.setUserId(response.user.id);
          this.props.setEmail(response.user.email);
          this.props.setUserCoopCycle(response.user.coopCycle);
          this.props.history.push("/home");
          this.findUserPlans(response);
        }
      });
    }
  }

  /**
   * Finds all of the user plans and sets the state based on the plan's information.
   */

  findUserPlans(response: any) {
    findAllPlansForUser(response.user.id, response.user.token).then(plans => {
      const namedSchedules = plans.map((plan: any) => ({
        name: plan.name,
        schedule: {
          present: {
            ...plan,
            currentClassCounter: plan.courseCounter,
            isScheduleLoading: false,
            scheduleError: "",
            major: plan.major,
            coopCycle: plan.coopCycle,
          } as ScheduleSlice,
        },
      }));
      this.props.setSchedules(namedSchedules);
      this.props.setMajorPlan(
        findMajorFromName(plans[0].major, this.props.majors),
        plans[0].coop_cycle ? plans[0].coop_cycle : ""
      );
    });
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
    // indicates if the user came from login button on welcome page
    const { fromOnBoarding } = (this.props.location.state as any) || {
      fromOnBoarding: false,
    };
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
  setMajorPlan: (major: Major | undefined, planStr: string) =>
    dispatch(setMajorPlanAction(major, planStr)),
  setToken: (token: string) => dispatch(setTokenAction(token)),
  setUserId: (id: number) => dispatch(setUserIdAction(id)),
  setSchedules: (schedules: NamedSchedule[]) =>
    dispatch(setSchedules(schedules)),
  setMajor: (major?: Major) => dispatch(setDeclaredMajorAction(major)),
  setUserCoopCycle: (coopCycle: string) =>
    dispatch(setUserCoopCycleAction(coopCycle)),
  setEmail: (email: string) => dispatch(setEmailAction(email)),
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */

const mapStateToProps = (state: AppState) => ({
  majors: getMajors(state),
});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */

export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginScreenComponent));
