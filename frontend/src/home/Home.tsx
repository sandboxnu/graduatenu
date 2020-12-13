import React from "react";
import "./Scrollbar.css";
import {
  DNDSchedule,
  IWarning,
  DNDScheduleTerm,
  IPlanData,
} from "../models/types";
import { Major, SeasonWord, ScheduleCourse } from "../../../common/types";
import styled from "styled-components";
import { convertTermIdToYear } from "../utils";
import { withToast } from "./toastHook";
import { AppearanceTypes } from "react-toast-notifications";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getUserIdFromState,
  getAcademicYearFromState,
  getClosedYearsFromState,
  getTransferCoursesFromState,
  getMajorsFromState,
  getActivePlanCoopCycleFromState,
  getActivePlanFromState,
  getActivePlanMajorFromState,
  getWarningsFromState,
} from "../state";
import {
  incrementCurrentClassCounterForActivePlanAction,
  updateSemesterForActivePlanAction,
  updateActivePlanAction,
  setUserPlansAction,
  setActivePlanDNDScheduleAction,
} from "../state/actions/userPlansActions";
import { EditPlanPopper } from "./EditPlanPopper";
import { updatePlanForUser } from "../services/PlanService";
import { AddPlan } from "./AddPlanPopper";
import { Button, Theme, withStyles } from "@material-ui/core";
import { SwitchPlanPopper } from "./SwitchPlanPopper";
import { resetUserAction } from "../state/actions/userActions";
import {
  getAuthToken,
  removeAuthTokenFromCookies,
} from "../utils/auth-helpers";
import { EditableSchedule } from "../components/Schedule/ScheduleComponents";

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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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

const PlanPopperButton = styled(Button)<any>`
  background: #e0e0e0;
  font-weight: normal;
  float: right;
  margin: 10px;
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

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: "#EB5757",
    "&:hover": {
      backgroundColor: "#DB4747",
    },
  },
}))(Button);

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
  major?: string;
  coopCycle?: string;
  warnings: IWarning[];
  userId: number;
  majors: Major[];
  academicYear: number;
  closedYears: Set<number>; // list of indexes of closed years
  activePlan?: IPlanData;
}

interface ReduxDispatchHomeProps {
  updateSemester: (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => void;
  setUserPlans: (plans: IPlanData[], academicYear: number) => void;
  updateActivePlan: (updatedPlan: Partial<IPlanData>) => void;
  setActivePlanDNDSchedule: (schedule: DNDSchedule) => void;
  logOut: () => void;
  incrementCurrentClassCounter: () => void;
}

type Props = ToastHomeProps &
  ReduxStoreHomeProps &
  ReduxDispatchHomeProps &
  RouteComponentProps;

class HomeComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.warnings !== this.props.warnings) {
      this.updateWarnings();
    }
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

  async updatePlan(showAlert = true) {
    const token = getAuthToken();
    await updatePlanForUser(
      this.props.userId!,
      token,
      this.props.activePlan!.id,
      this.props.activePlan!
    ).then((plan: IPlanData) => {
      this.props.updateActivePlan(plan);
      if (showAlert) {
        alert("Your plan has been updated successfully.");
      }
    });
  }

  logOut = async () => {
    await this.updatePlan(false);
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
        <HomePlan>
          <h2>Plan Of Study</h2>
        </HomePlan>
        <HomeButtons>
          <PlanContainer>
            <PlanPopperButton
              variant="contained"
              onClick={this.updatePlan.bind(this)}
            >
              Update Plan
            </PlanPopperButton>
          </PlanContainer>
          <PlanContainer>
            <AddPlan />
          </PlanContainer>
          <SwitchPlanPopper />
        </HomeButtons>
      </HomeAboveSchedule>
    );
  }

  render() {
    return (
      <>
        <HomeTop>
          <HomeTopInnerContainer>
            <HomeText href="#">GraduateNU</HomeText>
            <HomePlan>
              <MajorText>{this.props.major}</MajorText>
              <PlanText>{this.props.coopCycle || "None"}</PlanText>
              <EditPlanPopper />
              <LogoutButton onClick={_ => this.logOut()}>
                <ColorButton variant="contained">Logout</ColorButton>
              </LogoutButton>
            </HomePlan>
          </HomeTopInnerContainer>
        </HomeTop>
        <EditableSchedule sidebarPresent={true} transferCreditPresent={true}>
          {this.renderPlanHeader()}
        </EditableSchedule>
      </>
      // <>
      //   <HomeTop>
      //     <HomeTopInnerContainer>
      //       <HomeText href="#">GraduateNU</HomeText>
      //       <HomePlan>
      //         <MajorText>{this.props.major}</MajorText>
      //         <PlanText>{this.props.coopCycle || "None"}</PlanText>
      //         <EditPlanPopper />
      //         <LogoutButton onClick={_ => this.logOut()}>
      //           <ColorButton variant="contained">Logout</ColorButton>
      //         </LogoutButton>
      //       </HomePlan>
      //     </HomeTopInnerContainer>
      //   </HomeTop>
      //   <OuterContainer>
      //     <DragDropContext
      //       onDragEnd={this.onDragEnd}
      //       onDragUpdate={this.onDragUpdate}
      //     >
      //       <SidebarContainer>
      //         <Sidebar />
      //       </SidebarContainer>
      //       <LeftScroll className="hide-scrollbar">
      //         <Container>
      //           <HomeAboveSchedule>
      //             <HomePlan>
      //               <h2>Plan Of Study</h2>
      //             </HomePlan>
      //             <HomeButtons>
      //               <PlanContainer>
      //                 <PlanPopperButton
      //                   variant="contained"
      //                   onClick={this.updatePlan.bind(this)}
      //                 >
      //                   Update Plan
      //                 </PlanPopperButton>
      //               </PlanContainer>
      //               <PlanContainer>
      //                 <AddPlan />
      //               </PlanContainer>
      //               <SwitchPlanPopper />
      //             </HomeButtons>
      //           </HomeAboveSchedule>
      //           {this.renderYears()}
      //           {this.renderTransfer()}
      //         </Container>
      //       </LeftScroll>
      //     </DragDropContext>
      //   </OuterContainer>
      // </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  transferCredits: getTransferCoursesFromState(state),
  major: getActivePlanMajorFromState(state),
  coopCycle: getActivePlanCoopCycleFromState(state),
  warnings: getWarningsFromState(state),
  userId: getUserIdFromState(state)!,
  majors: getMajorsFromState(state),
  academicYear: getAcademicYearFromState(state)!,
  closedYears: getClosedYearsFromState(state),
  activePlan: getActivePlanFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateSemester: (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => dispatch(updateSemesterForActivePlanAction(year, season, newSemester)),
  setUserPlans: (plans: IPlanData[], academicYear: number) =>
    dispatch(setUserPlansAction(plans, academicYear)),
  updateActivePlan: (updatedPlan: Partial<IPlanData>) =>
    dispatch(updateActivePlanAction(updatedPlan)),
  setActivePlanDNDSchedule: (schedule: DNDSchedule) =>
    dispatch(setActivePlanDNDScheduleAction(schedule)),
  logOut: () => dispatch(resetUserAction()),
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
