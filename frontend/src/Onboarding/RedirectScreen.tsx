import React from "react";
import Cookies from "universal-cookie";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Major } from "../../../common/types";
import { fetchUser } from "../services/UserService";
import {
  setFullNameAction,
  setTokenAction,
  setUserIdAction,
  setDeclaredMajorAction,
  setUserCoopCycleAction,
  setEmailAction,
  setIsAdvisor,
} from "../state/actions/userActions";
import { AppState } from "../state/reducers/state";
import { findMajorFromName } from "../utils/plan-helpers";
import {
  getAcademicYearFromState,
  getGraduationYearFromState,
  getMajors,
  getMajorsLoadingFlag,
} from "../state";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";

interface State {
  isAdvisor: boolean | null;
}

interface ReduxStateRedirectProps {
  majors: Major[];
  isFetchingMajors: boolean;
  academicYear?: number;
  graduationYear?: number;
}

interface ReduxDispatchRedirectProps {
  setFullName: (fullName: string) => void;
  setUserMajor: (major: Major) => void;
  setUserCoopCycle: (coopCycle: string) => void;
  setToken: (token: string) => void;
  setUserId: (id: number) => void;
  setEmail: (email: string) => void;
  setIsAdvisor: (isAdvisor: boolean) => void;
  fetchMajorsAndPlans: () => void;
}

type Props = ReduxStateRedirectProps & ReduxDispatchRedirectProps;

const cookies = new Cookies();

class RedirectScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isAdvisor: null,
    };
  }

  componentDidMount() {
    this.props.fetchMajorsAndPlans();
  }

  componentDidUpdate(prevProps: Props) {
    // if finished loading majors
    if (
      !!prevProps.isFetchingMajors &&
      !this.props.isFetchingMajors &&
      this.props.majors.length > 0
    ) {
      if (cookies.get("auth_token")) {
        fetchUser(cookies.get("auth_token")).then(response => {
          this.props.setFullName(response.user.username);
          const maj = findMajorFromName(response.user.major, this.props.majors);
          if (maj) {
            this.props.setUserMajor(maj);
          }
          this.props.setToken(response.user.token); // set auth token
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
  }

  needsToGoToOnboarding() {
    return !this.props.graduationYear || !this.props.academicYear;
  }

  render() {
    if (!cookies.get("auth_token")) {
      return <div>No auth token cookie</div>;
    }

    if (this.state.isAdvisor == null) {
      return <div>Loading...</div>;
    }

    if (this.state.isAdvisor === false) {
      if (this.needsToGoToOnboarding()) {
        return <Redirect to="/onboarding" />;
      } else {
        return <Redirect to="/home" />;
      }
    }

    if (this.state.isAdvisor === true) {
      return <Redirect to="/advisor" />;
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  majors: getMajors(state),
  isFetchingMajors: getMajorsLoadingFlag(state),
  academicYear: getAcademicYearFromState(state),
  graduationYear: getGraduationYearFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFullName: (fullName: string) => dispatch(setFullNameAction(fullName)),
  setUserMajor: (major: Major) => dispatch(setDeclaredMajorAction(major)),
  setToken: (token: string) => dispatch(setTokenAction(token)),
  setUserId: (id: number) => dispatch(setUserIdAction(id)),
  setMajor: (major?: Major) => dispatch(setDeclaredMajorAction(major)),
  setUserCoopCycle: (coopCycle: string) =>
    dispatch(setUserCoopCycleAction(coopCycle)),
  setEmail: (email: string) => dispatch(setEmailAction(email)),
  setIsAdvisor: (isAdvisor: boolean) => dispatch(setIsAdvisor(isAdvisor)),
  fetchMajorsAndPlans: () => fetchMajorsAndPlans()(dispatch),
});

export const RedirectScreen = connect<
  ReduxStateRedirectProps,
  ReduxDispatchRedirectProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(RedirectScreenComponent);
