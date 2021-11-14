import React from "react";
import "./Scrollbar.css";
import { IWarning, IPlanData } from "../models/types";
import { Major, ScheduleCourse } from "../../../common/types";
import styled from "styled-components";
import { convertTermIdToYear } from "../utils";
import { withToast } from "./toastHook";
import { AppearanceTypes } from "react-toast-notifications";
import { withRouter, RouteComponentProps, Prompt } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getUserIdFromState,
  getAcademicYearFromState,
  getClosedYearsFromState,
  safelyGetTransferCoursesFromState,
  getMajorsFromState,
  getActivePlanCoopCycleFromState,
  getActivePlanFromState,
  getActivePlanMajorFromState,
  safelyGetWarningsFromState,
  getActivePlanStatusFromState,
} from "../state";
import {
  incrementCurrentClassCounterForActivePlanAction,
  updateActivePlanAction,
  setUserPlansAction,
} from "../state/actions/userPlansActions";
import { EditPlanPopper } from "./EditPlanPopper";
import {
  sendChangeLog,
  updatePlanForUser,
  updatePlanLastViewed,
} from "../services/PlanService";
import { AddPlan } from "./AddPlanPopper";

import { SwitchPlanPopper } from "./SwitchPlanPopper";
import { resetStudentAction } from "../state/actions/studentActions";
import { removeAuthTokenFromCookies } from "../utils/auth-helpers";
import { RequestFeedbackPopper } from "./RequestFeedbackPopper";
import {
  EditableSchedule,
  NonEditableScheduleStudentView,
} from "../components/Schedule/ScheduleComponents";
import { convertPlanToUpdatePlanData } from "../utils/plan-helpers";
import { ActivePlanAutoSaveStatus } from "../state/reducers/userPlansReducer";
import { AutoSavePlan } from "./AutoSavePlan";
import { Alert } from "@material-ui/lab";
import IdleTimer from "react-idle-timer";
import ScheduleChangeTracker from "../utils/ScheduleChangeTracker";
import { RedColorButton } from "../components/common/ColoredButtons";

const HomeTop = styled.div`
  width: 100%;
  border-bottom: 1px solid red;
`;

const HomeTopInnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
`;

const HomeText = styled.a`
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
  color: black;
`;

const HomePlan = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HomeAboveSchedule = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HomeHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AlertWrapper = styled.div`
  margin: 12px 0px 12px 0px;
`;

const MajorText = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-right: 4px;
`;

const PlanText = styled.div`
  font-weight: normal;
  font-size: 16px;
  margin-right: 4px;
`;

const HomeButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  padding: 10px 0;
  space-between: 5;
`;

const PlanContainer = styled.div`
  position: relative;
  align-items: flex-end;
  margin-right: 10px;
`;

const LogoutButton = styled.div`
  align-self: center;
  margin-right: 8px !important;
`;

interface ToastHomeProps {
  addToast: (message: string, options: any) => void;
  removeToast: (id: string) => void;
  toastStack: {
    content: React.ReactNode;
    id: string;
    appearance: AppearanceTypes;
  }[];
}

interface ReduxStoreHomeProps {
  transferCredits: ScheduleCourse[];
  major: string | null;
  coopCycle: string | null;
  warnings: IWarning[];
  userId: number;
  majors: Major[];
  academicYear: number;
  closedYears: Set<number>; // list of indexes of closed years
  activePlan: IPlanData;
  activePlanStatus: ActivePlanAutoSaveStatus;
}

interface ReduxDispatchHomeProps {
  setUserPlans: (
    plans: IPlanData[],
    academicYear: number,
    transferCourses: ScheduleCourse[]
  ) => void;
  updateActivePlan: (updatedPlan: Partial<IPlanData>) => void;
  logOut: () => void;
  incrementCurrentClassCounter: () => void;
}

type Props = ToastHomeProps &
  ReduxStoreHomeProps &
  ReduxDispatchHomeProps &
  RouteComponentProps;

const VIEWING_BUFFER = 30000; // 30 seconds
const TIMEOUT = 900000; // 15 minutes

class HomeComponent extends React.Component<Props> {
  interval: number | null = null;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.callUpdatePlanLastViewedOnInterval();
  }

  componentDidUpdate(nextProps: Props) {
    if (
      JSON.stringify(nextProps.warnings) !== JSON.stringify(this.props.warnings)
    ) {
      this.updateWarnings();
    }

    if (this.shouldBlockNavigation()) {
      window.onbeforeunload = () => true;
    } else {
      //@ts-ignore
      window.onbeforeunload = undefined;
    }

    if (this.props.activePlan.id !== nextProps.activePlan.id) {
      // switched plan
      this.callUpdatePlanLastViewedOnInterval();
    }
    window.addEventListener("beforeunload", this.sendPlanUpdates);
  }

  componentWillUnmount() {
    this.sendPlanUpdates();
    window.removeEventListener("beforeunload", this.sendPlanUpdates);
    window.onbeforeunload = null;
  }

  callUpdatePlanLastViewedOnInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.props.activePlan && this.props.userId) {
        updatePlanLastViewed(
          this.props.userId,
          this.props.activePlan.id,
          this.props.userId
        );
      }
    }, VIEWING_BUFFER);
  }

  sendPlanUpdates = () => {
    const changes = ScheduleChangeTracker.getInstance().getChanges();
    if (changes !== "") {
      sendChangeLog(
        this.props.activePlan.id,
        this.props.userId,
        this.props.userId,
        changes
      );
      ScheduleChangeTracker.getInstance().clearChanges();
    }
  };

  shouldBlockNavigation() {
    return this.props.activePlanStatus !== "Up To Date";
  }

  updateWarnings() {
    // remove existing toasts
    this.props.toastStack.forEach(t => this.props.removeToast(t.id));

    let numVisibleWarnings: number = 0;
    this.props.warnings.forEach(w => {
      //ensuring we only propogate 5 toasts at a time
      const yearIdx = this.props.activePlan!.schedule.years.indexOf(
        convertTermIdToYear(w.termId)
      );
      if (!this.props.closedYears.has(yearIdx)) {
        numVisibleWarnings++;
        if (numVisibleWarnings <= 5) {
          // add new toasts
          this.props.addToast(w.message, {
            appearance: "warning",
            autoDismiss: true,
          });
        }
      }
    });
  }

  async updatePlan() {
    await updatePlanForUser(
      this.props.userId,
      this.props.activePlan.id,
      convertPlanToUpdatePlanData(this.props.activePlan, this.props.userId)
    ).then(response => {
      this.props.updateActivePlan(response.plan);
    });
  }

  onIdle = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    alert("You are now idle. The page will now refresh.");
    window.location.reload();
  };

  logOut = async () => {
    await this.updatePlan();
    window.location.reload();
    removeAuthTokenFromCookies();

    alert(
      "Your plan has been updated and you have been logged out. You will be redirected to the welcome screen."
    );
    this.props.history.push("/");
    this.props.logOut();
  };

  renderPlanHeader() {
    return (
      <HomeAboveSchedule>
        <HomeHeaderWrapper>
          <HomePlan>
            <h2>Plan Of Study</h2>
          </HomePlan>
          <HomeButtons>
            <PlanContainer>
              <AutoSavePlan />
            </PlanContainer>
            <PlanContainer>
              <RequestFeedbackPopper />
            </PlanContainer>
            <PlanContainer>
              <AddPlan />
            </PlanContainer>
            <SwitchPlanPopper />
          </HomeButtons>
        </HomeHeaderWrapper>
        {this.props.activePlan.isCurrentlyBeingEditedByAdvisor && (
          <AlertWrapper>
            <Alert severity="warning">
              This plan is currently being edited by your advisor, so we've put
              it in read-only mode. You will be able to edit it again once your
              advisor finishes their changes.
            </Alert>
          </AlertWrapper>
        )}
      </HomeAboveSchedule>
    );
  }

  render() {
    return (
      <>
        <IdleTimer
          element={document}
          onIdle={this.onIdle}
          debounce={250}
          timeout={TIMEOUT}
        />
        <Prompt
          when={this.shouldBlockNavigation()}
          message="You have unsaved changes, are you sure you want to leave?"
        />
        <HomeTop>
          <HomeTopInnerContainer>
            <HomeText href="#">GraduateNU</HomeText>
            <HomePlan>
              <MajorText>{this.props.major}</MajorText>
              <PlanText>{this.props.coopCycle || "None"}</PlanText>
              <EditPlanPopper />
              <LogoutButton onClick={_ => this.logOut()}>
                <RedColorButton variant="contained">Logout</RedColorButton>
              </LogoutButton>
            </HomePlan>
          </HomeTopInnerContainer>
        </HomeTop>
        {this.props.activePlan.isCurrentlyBeingEditedByAdvisor ? (
          <NonEditableScheduleStudentView
            sidebarPresent
            transferCreditPresent
            collapsibleYears
            commentsPresent
          >
            {this.renderPlanHeader()}
          </NonEditableScheduleStudentView>
        ) : (
          <EditableSchedule
            sidebarPresent
            transferCreditPresent
            collapsibleYears
            commentsPresent
          >
            {this.renderPlanHeader()}
          </EditableSchedule>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  transferCredits: safelyGetTransferCoursesFromState(state),
  major: getActivePlanMajorFromState(state),
  coopCycle: getActivePlanCoopCycleFromState(state),
  warnings: safelyGetWarningsFromState(state),
  userId: getUserIdFromState(state),
  majors: getMajorsFromState(state),
  academicYear: getAcademicYearFromState(state)!,
  closedYears: getClosedYearsFromState(state),
  activePlan: getActivePlanFromState(state),
  activePlanStatus: getActivePlanStatusFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserPlans: (
    plans: IPlanData[],
    academicYear: number,
    transferCourses: ScheduleCourse[]
  ) => dispatch(setUserPlansAction(plans, academicYear, transferCourses)),
  updateActivePlan: (updatedPlan: Partial<IPlanData>) =>
    dispatch(updateActivePlanAction(updatedPlan)),
  logOut: () => dispatch(resetStudentAction()),
  incrementCurrentClassCounter: () =>
    dispatch(incrementCurrentClassCounterForActivePlanAction()),
});

export const Home = connect<
  ReduxStoreHomeProps,
  ReduxDispatchHomeProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withToast(HomeComponent)));
