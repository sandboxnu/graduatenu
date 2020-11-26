import React from "react";
import Cookies from "universal-cookie";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Major } from "../../../common/types";
import { fetchUser } from "../services/UserService";
import {
  setFullNameAction,
  setAcademicYearAction,
  setGraduationYearAction,
  setMajorPlanAction,
  setTokenAction,
  setUserIdAction,
  setDeclaredMajorAction,
  setUserCoopCycleAction,
  setEmailAction,
  setIsAdvisor,
} from "../state/actions/userActions";
import { AppState } from "../state/reducers/state";

interface State {
  isAdvisor: boolean | null;
}

interface ReduxDispatchRedirectProps {
  setFullName: (fullName: string) => void;
  setAcademicYear: (academicYear: number) => void;
  setGraduationYear: (graduationYear: number) => void;
  setMajorPlan: (major: Major | undefined, planStr: string) => void;
  setUserCoopCycle: (coopCycle: string) => void;
  setToken: (token: string) => void;
  setUserId: (id: number) => void;
  setEmail: (email: string) => void;
  setIsAdvisor: (isAdvisor: boolean) => void;
}

type Props = ReduxDispatchRedirectProps;

const cookies = new Cookies();

class RedirectScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log(cookies.getAll());
    this.state = {
      isAdvisor: null,
    };
  }

  componentDidMount() {
    if (cookies.get("auth_token")) {
      fetchUser(cookies.get("auth_token")).then(response => {
        this.props.setFullName(response.user.username);
        this.props.setAcademicYear(response.user.academicYear);
        this.props.setGraduationYear(response.user.graduationYear);
        this.props.setToken(response.user.token);
        this.props.setUserId(response.user.id);
        this.props.setEmail(response.user.email);
        this.props.setUserCoopCycle(response.user.coopCycle);
        this.props.setIsAdvisor(response.user.isAdvisor);

        this.setState({
          isAdvisor: response.user.isAdvisor,
        });
      });
    }
  }

  render() {
    if (!cookies.get("auth_token")) {
      return <div>No auth token cookie</div>;
    }

    if (this.state.isAdvisor == null) {
      return <div>Loading...</div>;
    }

    if (this.state.isAdvisor === false) {
      return <Redirect to="/home" />;
    }

    if (this.state.isAdvisor === true) {
      return <Redirect to="/advisor" />;
    }
  }
}

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
  setMajor: (major?: Major) => dispatch(setDeclaredMajorAction(major)),
  setUserCoopCycle: (coopCycle: string) =>
    dispatch(setUserCoopCycleAction(coopCycle)),
  setEmail: (email: string) => dispatch(setEmailAction(email)),
  setIsAdvisor: (isAdvisor: boolean) => dispatch(setIsAdvisor(isAdvisor)),
});

export const RedirectScreen = connect<
  {},
  ReduxDispatchRedirectProps,
  {},
  AppState
>(
  null,
  mapDispatchToProps
)(RedirectScreenComponent);
