import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  DNDSchedule,
  Major,
  Schedule,
  Status,
  SeasonWord,
  IWarning,
  DNDScheduleYear,
  DNDScheduleTerm,
} from "../models/types";
import styled from "styled-components";
import { Year } from "../components/Year";
import {
  convertTermIdToYear,
  convertTermIdToSeason,
  isCoopOrVacation,
  moveCourse,
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
} from "../state";
import {
  updateSemesterAction,
  setScheduleAction,
  setDNDScheduleAction,
  setCoopCycle,
} from "../state/actions/scheduleActions";
import { setMajorAction } from "../state/actions/userActions";
import { getMajors, getPlans } from "../state";
import { EditPlanPopper } from "./EditPlanPopper";

const OuterContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const SidebarContainer = styled.div`
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex: 5;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 30px;
  background-color: "#ff76ff";
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
  majors: Major[];
  plans: Record<string, Schedule[]>;
}

interface ReduxDispatchHomeProps {
  updateSemester: (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => void;
  setCoopCycle: (schedule?: Schedule) => void;
  setSchedule: (schedule: Schedule) => void;
  setDNDSchedule: (schedule: DNDSchedule) => void;
  setMajor: (major?: Major) => void;
}

type Props = ToastHomeProps &
  ReduxStoreHomeProps &
  ReduxDispatchHomeProps &
  RouteComponentProps;

class HomeComponent extends React.Component<Props> {
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

  onDragEnd = (result: any) => {
    const { destination, source } = result;

    moveCourse(
      this.props.schedule,
      destination,
      source,
      this.props.setDNDSchedule
    );
  };

  onDragUpdate = (update: any) => {
    const { destination } = update;
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
    return this.props.schedule.years.map((year: number, index: number) => (
      <Year key={index} index={index} schedule={this.props.schedule} />
    ));
  }

  render() {
    return (
      <OuterContainer>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragUpdate={this.onDragUpdate}
        >
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
            <HomePlan>
              <h2>Plan Of Study</h2>
            </HomePlan>
            {this.renderYears()}
          </Container>
        </DragDropContext>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
      </OuterContainer>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
  planStr: getPlanStrFromState(state),
  major: getMajorFromState(state),
  warnings: getWarningsFromState(state),
  majors: getMajors(state),
  plans: getPlans(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateSemester: (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => dispatch(updateSemesterAction(year, season, newSemester)),
  setCoopCycle: (schedule?: Schedule) => dispatch(setCoopCycle(schedule)),
  setSchedule: (schedule: Schedule) => dispatch(setScheduleAction(schedule)),
  setDNDSchedule: (schedule: DNDSchedule) =>
    dispatch(setDNDScheduleAction(schedule)),
  setMajor: (major?: Major) => dispatch(setMajorAction(major)),
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
