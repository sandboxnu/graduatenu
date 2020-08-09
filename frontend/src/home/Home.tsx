import React from "react";
import "./Scrollbar.css";
import { DragDropContext } from "react-beautiful-dnd";
import {
  DNDSchedule,
  IWarning,
  DNDScheduleYear,
  DNDScheduleTerm,
  IPlanData,
  NamedSchedule,
  ScheduleSlice,
} from "../models/types";
import { Schedule, Major, Status, SeasonWord } from "../../../common/types";
import { addPrereqsToSchedule } from "../../../common/prereq_loader";
import styled from "styled-components";
import { Year } from "../components/Year";
import {
  convertTermIdToYear,
  convertTermIdToSeason,
  isCoopOrVacation,
  moveCourse,
  addCourseFromSidebar,
  convertToDNDSchedule,
} from "../utils";
import { Sidebar } from "../components/Sidebar";
import { withToast } from "./toastHook";
import { AppearanceTypes } from "react-toast-notifications";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getScheduleFromState,
  getPlanStrFromState,
  getMajorFromState,
  getWarningsFromState,
  getTokenFromState,
  getUserId,
  getPlanNameFromState,
  getPlanIdsFromState,
  getLinkSharingFromState,
  getScheduleDataFromState,
} from "../state";
import {
  updateSemesterAction,
  setDNDScheduleAction,
} from "../state/actions/scheduleActions";
import {
  setLinkSharingAction,
  setPlanNameAction,
  setMajorPlanAction,
  setPlanIdsAction,
} from "../state/actions/userActions";
import {
  updateActiveSchedule,
  addNewSchedule,
} from "../state/actions/schedulesActions";
import { getMajors, getPlans } from "../state";
import { EditPlanPopper } from "./EditPlanPopper";
import {
  createPlanForUser,
  findAllPlansForUser,
  updatePlanForUser,
} from "../services/PlanService";
import { findMajorFromName } from "../utils/plan-helpers";
import { Button } from "@material-ui/core";
import Loader from "react-loader-spinner";
import { ExcelUpload } from "../components/ExcelUpload";
import { SwitchPlanPopper } from "./SwitchPlanPopper";

const OuterContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const SidebarContainer = styled.div`
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 4;
  position: relative;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
`;

const LeftScroll = styled.div`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  flex: 19;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 30px;
  background-color: "#ff76ff";
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;
`;

const HomeTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 6px;
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
  padding: 10px;
  margin: 0px;
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
  schedule: DNDSchedule;
  major?: Major;
  planStr?: string;
  warnings: IWarning[];
  token?: string;
  userId?: number;
  majors: Major[];
  planIds: number[];
  planName: string | undefined;
  linkSharing: boolean;
  getCurrentScheduleData: () => ScheduleSlice;
}

interface ReduxDispatchHomeProps {
  updateSemester: (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => void;
  setDNDSchedule: (schedule: DNDSchedule) => void;
  setMajorPlans: (major: Major | undefined, planStr: string) => void;
  setPlanName: (name: string) => void;
  setLinkSharing: (linkSharing: boolean) => void;
  setPlanIds: (planIds: number[]) => void;
  addNewSchedule: (newSchedule: NamedSchedule) => void;
  updateActiveSchedule: (updatedSchedule: NamedSchedule) => void;
}

type Props = ToastHomeProps &
  ReduxStoreHomeProps &
  ReduxDispatchHomeProps &
  RouteComponentProps;

interface HomeState {
  fetchedPlan: boolean;
  planCount: number;
}

class HomeComponent extends React.Component<Props, HomeState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fetchedPlan: false,
      planCount: 1,
    };
  }

  componentDidMount() {
    // If this is true, then a user is currently logged in and we can fetch their plan
    if (this.props.token && this.props.userId) {
      findAllPlansForUser(this.props.userId, this.props.token).then(
        (plans: IPlanData[]) => {
          // Once multiple plans are supported, this can be changed to the last used plan
          let plan: IPlanData = plans[0];

          this.props.setPlanIds(plans.map(plan => plan.id));
          this.props.setDNDSchedule(plan.schedule);
          this.props.setMajorPlans(
            findMajorFromName(plan.major, this.props.majors),
            plan.planString
          );
          this.props.setPlanName(plan.name);
          this.props.setLinkSharing(plan.link_sharing_enabled);

          this.setState({
            fetchedPlan: true,
            planCount: plans.length,
          });
        }
      );
    }
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.warnings !== this.props.warnings) {
      this.updateWarnings();
    }
  }

  updateWarnings() {
    // remove existing toasts
    this.props.toastStack.forEach(t => this.props.removeToast(t.id));

    let numWarnings: number = 0;
    this.props.warnings.forEach(w => {
      //ensuring we only propogate 5 toasts at a time
      numWarnings++;
      if (numWarnings <= 5) {
        // add new toasts
        this.props.addToast(w.message, {
          appearance: "warning",
          autoDismiss: true,
        });
      }
    });
  }

  onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // if drag is coming from the sidebar
    if (isNaN(Number(source.droppableId))) {
      addCourseFromSidebar(
        this.props.schedule,
        destination,
        source,
        this.props.setDNDSchedule,
        draggableId
      );
    } else {
      moveCourse(
        this.props.schedule,
        destination,
        source,
        this.props.setDNDSchedule
      );
    }
  };

  onSidebarDragEnd = (result: any) => {
    const { destination, source } = result;

    moveCourse(
      this.props.schedule,
      destination,
      source,
      this.props.setDNDSchedule
    );
  };

  onDragUpdate = (update: any) => {
    const { destination, source } = update;

    if (isNaN(Number(source.droppableId))) {
      return;
    }

    if (!destination || !destination.droppableId) return;

    const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
    const destSemesterYear = convertTermIdToYear(destination.droppableId);
    const destYear: DNDScheduleYear = this.props.schedule.yearMap[
      destSemesterYear
    ];
    const destSemester: DNDScheduleTerm = JSON.parse(
      JSON.stringify((destYear as any)[destSemesterSeason])
    ); // deep copy

    this.removeHovers(destSemester);

    if (
      destSemester.status === "INACTIVE" ||
      destSemester.status === "COOP" ||
      destSemester.status === "HOVERINACTIVE" ||
      destSemester.status === "HOVERCOOP"
    ) {
      if (destSemester.status === "INACTIVE") {
        destSemester.status = "HOVERINACTIVE";
      } else if (destSemester.status === "COOP") {
        destSemester.status = "HOVERCOOP";
      } else if (destSemester.status === "HOVERINACTIVE") {
        destSemester.status = "INACTIVE";
      } else if (destSemester.status === "HOVERCOOP") {
        destSemester.status = "COOP";
      }

      this.props.updateSemester(
        destSemesterYear,
        destSemesterSeason,
        destSemester
      );
    }
  };

  removeHovers(currSemester: DNDScheduleTerm) {
    for (const yearnum of this.props.schedule.years) {
      const year = JSON.parse(
        JSON.stringify(this.props.schedule.yearMap[yearnum])
      ); // deep copy
      if (isCoopOrVacation(year.fall) && year.fall !== currSemester) {
        year.fall.status = year.fall.status.replace("HOVER", "") as Status;
        this.props.updateSemester(yearnum, "fall", year.fall);
      }
      if (isCoopOrVacation(year.spring) && year.spring !== currSemester) {
        year.spring.status = year.spring.status.replace("HOVER", "") as Status;
        this.props.updateSemester(yearnum, "spring", year.spring);
      }
      if (isCoopOrVacation(year.summer1) && year.summer1 !== currSemester) {
        year.summer1.status = year.summer1.status.replace(
          "HOVER",
          ""
        ) as Status;
        this.props.updateSemester(yearnum, "summer1", year.summer1);
      }
      if (isCoopOrVacation(year.summer2) && year.summer2 !== currSemester) {
        year.summer2.status = year.summer2.status.replace(
          "HOVER",
          ""
        ) as Status;
        this.props.updateSemester(yearnum, "summer2", year.summer2);
      }
    }
  }

  renderYears() {
    // If a user is currently logged in, wait until plans are fetched to render
    if (this.props.token && this.props.userId) {
      if (this.state.fetchedPlan) {
        return this.props.schedule.years.map((year: number, index: number) => (
          <Year key={index} index={index} schedule={this.props.schedule} />
        ));
      } else {
        return (
          <SpinnerWrapper>
            <Loader
              type="Puff"
              color="#f50057"
              height={100}
              width={100}
              timeout={5000} //5 secs
            />
          </SpinnerWrapper>
        );
      }
    } else {
      return this.props.schedule.years.map((year: number, index: number) => (
        <Year key={index} index={index} schedule={this.props.schedule} />
      ));
    }
  }

  /**
   * If a user is currently logged in, updates the current plan under this user.
   * Only supports updating a user's singular plan, can be modified later to
   * update a specific plan.
   */
  updatePlan() {
    // If this is true, then a user is currently logged in and we can update their plan
    if (this.props.token && this.props.userId) {
      const scheduleData: ScheduleSlice = this.props.getCurrentScheduleData();
      updatePlanForUser(
        this.props.userId,
        this.props.token,
        this.props.planIds[0],
        {
          id: this.props.planIds[0],
          name: this.props.planName ? this.props.planName : "",
          link_sharing_enabled: this.props.linkSharing,
          schedule: this.props.schedule,
          major: this.props.major ? this.props.major.name : "",
          planString: this.props.planStr ? this.props.planStr : "None",
          // course_counter: scheduleData.currentClassCounter,
          // warnings: scheduleData.warnings,
          // course_warnings: scheduleData.courseWarnings,
        }
      ).then(plan => alert("Your plan has been saved."));
    } else {
      alert("You must be logged in to save your plan.");
    }
  }

  /**
   * If a user is currently logged in, saves the current plan under this user.
   * Only supports updating a user's singular plan, can be modified later to
   * update a specific plan.
   */
  savePlan() {
    // If this is true, then a user is currently logged in and we can update their plan
    if (this.props.token && this.props.userId) {
      const scheduleData: ScheduleSlice = this.props.getCurrentScheduleData();
      createPlanForUser(this.props.userId, this.props.token, {
        name: `Schedule${this.state.planCount + 1}`,
        link_sharing_enabled: this.props.linkSharing,
        schedule: this.props.schedule,
        major: this.props.major ? this.props.major.name : "",
        planString: this.props.planStr ? this.props.planStr : "None",
        // course_counter: scheduleData.currentClassCounter,
        // warnings: scheduleData.warnings,
        // course_warnings: scheduleData.courseWarnings,
      }).then(plan => {
        this.props.addNewSchedule({
          name: plan.plan.name,
          schedule: plan.plan.schedule,
        });
        this.setState({ planCount: this.state.planCount + 1 });
        alert("Your plan has been saved.");
      });
    } else {
      alert("You must be logged in to save your plan.");
    }
  }

  async setSchedule(schedule: Schedule) {
    let preReqSched = await addPrereqsToSchedule(schedule);
    const [dndschedule, counter] = convertToDNDSchedule(preReqSched, 0);
    this.props.setDNDSchedule(dndschedule);
  }

  render() {
    return (
      <OuterContainer>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragUpdate={this.onDragUpdate}
        >
          <LeftScroll className="hide-scrollbar">
            <Container>
              <HomeTop>
                <HomeText href="#">GraduateNU</HomeText>
                <HomePlan>
                  <MajorText>
                    {!!this.props.major ? this.props.major.name + ": " : ""}
                  </MajorText>
                  <PlanText>{this.props.planStr || "None"}</PlanText>
                  <EditPlanPopper />
                </HomePlan>
              </HomeTop>
              <HomeAboveSchedule>
                <HomePlan>
                  <h2>Plan Of Study</h2>
                  {this.props.token && this.props.userId && (
                    <SwitchPlanPopper />
                  )}
                </HomePlan>
                <HomeButtons>
                  <PlanContainer>
                    <PlanPopperButton
                      variant="contained"
                      onClick={this.savePlan.bind(this)}
                    >
                      Save Plan
                    </PlanPopperButton>
                  </PlanContainer>

                  <PlanContainer>
                    <PlanPopperButton
                      variant="contained"
                      onClick={this.updatePlan.bind(this)}
                    >
                      Update Plan
                    </PlanPopperButton>
                  </PlanContainer>
                  <ExcelUpload setSchedule={this.setSchedule.bind(this)} />
                </HomeButtons>
              </HomeAboveSchedule>
              {this.renderYears()}
            </Container>
          </LeftScroll>
          <SidebarContainer>
            <Sidebar />
          </SidebarContainer>
        </DragDropContext>
      </OuterContainer>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
  planStr: getPlanStrFromState(state),
  major: getMajorFromState(state),
  warnings: getWarningsFromState(state),
  token: getTokenFromState(state),
  userId: getUserId(state),
  majors: getMajors(state),
  planName: getPlanNameFromState(state),
  planIds: getPlanIdsFromState(state),
  linkSharing: getLinkSharingFromState(state),
  getCurrentScheduleData: () => getScheduleDataFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateSemester: (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => dispatch(updateSemesterAction(year, season, newSemester)),
  setDNDSchedule: (schedule: DNDSchedule) =>
    dispatch(setDNDScheduleAction(schedule)),
  setPlanName: (name: string) => dispatch(setPlanNameAction(name)),
  setLinkSharing: (linkSharing: boolean) =>
    dispatch(setLinkSharingAction(linkSharing)),
  setMajorPlans: (major: Major | undefined, planStr: string) =>
    dispatch(setMajorPlanAction(major, planStr)),
  setPlanIds: (planIds: number[]) => dispatch(setPlanIdsAction(planIds)),
  addNewSchedule: (newSchedule: NamedSchedule) =>
    dispatch(addNewSchedule(newSchedule)),
  updateActiveSchedule: (updatedSchedule: NamedSchedule) =>
    dispatch(updateActiveSchedule(updatedSchedule)),
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
