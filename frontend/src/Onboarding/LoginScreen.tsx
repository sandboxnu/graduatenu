import React from "react";
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

interface LoginScreenState {
  emailStr: string;
  passwordStr: string;
  beenEditedEmail: boolean;
  beenEditedPassword: boolean;
  validEmail: boolean;
  error?: string;
}

interface LoginResponse {
  user: IUserData & { token: string };
  errors: any;
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

      loginUser(user).then((response: LoginResponse) => {
        console.log(response);
        if (response.errors) {
          this.setState({
            error: "invalid",
          });
        } else {
          this.props.setStudent(response.user);
          Cookies.set(AUTH_TOKEN_COOKIE_KEY, response.user.token, {
            path: "/",
            domain: window.location.hostname,
          });
          this.props.history.push("/home");
          // this.findUserPlans(response);
        }
      });
    }
  }

  /**
   * Finds all of the user plans and sets the state based on the plan's information.
   */
  // findUserPlans(response: any) {
  //   findAllPlansForUser(response.user.id).then(plans => {
  //     const planNameToPlan: Record<string, IPlanData> = {};
  //     plans.forEach(plan => {
  //       planNameToPlan[plan.name] = plan;
  //     });

  //     const planToClosedYears: Record<string, number[]> = {};
  //     plans.forEach(plan => {
  //       planToClosedYears[plan.name] = [];
  //     });

  //     const activePlanId = response.user.primaryPlanId;
  //     const activePlanName = plans.find(plan => plan.id === activePlanId)?.name;

  //     const userPlansData: UserPlansState = {
  //       activePlan: activePlanName,
  //       plans: planNameToPlan,
  //       activePlanStatus: "Up To Date",
  //       closedYears: planToClosedYears,
  //     };
  //   });
  // }

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
        <ButtonContainer>
          <PrimaryButton onClick={this.submit.bind(this)}>Log In</PrimaryButton>
          <SecondaryLinkButton to="/">Back</SecondaryLinkButton>
        </ButtonContainer>
      </Wrapper>
    );
  }
}

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
