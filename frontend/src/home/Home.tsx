import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { mockData } from "../data/mockData";
import {
  DNDSchedule,
  Major,
  ScheduleCourse,
  Schedule,
  Status,
  SeasonWord,
  IWarning,
  DNDScheduleYear,
  DNDScheduleTerm,
  IUserData,
} from "../models/types";
import styled from "styled-components";
import { Year } from "../components/Year";
import {
  convertTermIdToYear,
  convertTermIdToSeason,
  convertToDNDSchedule,
  convertToDNDCourses,
  isCoopOrVacation,
  addClassToSchedule,
  produceWarnings,
  moveCourse,
} from "../utils";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { majors } from "../majors";
import { ChooseMajorPlanModal } from "../components";
import { CLASS_BLOCK_WIDTH } from "../constants";
import { DropDownModal } from "../components";
import { Sidebar } from "../components/Sidebar";
import { withToast } from "./toastHook";
import { AppearanceTypes } from "react-toast-notifications";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { plans } from "../plans";

const OuterContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const CompletedCoursesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: ${CLASS_BLOCK_WIDTH * 4 + 25}px;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 30px;
  background-color: "#ff76ff";
`;

interface HomeProps {
  addToast: (message: string, options: any) => void;
  removeToast: (id: string) => void;
  toastStack: {
    content: React.ReactNode;
    id: string;
    appearance: AppearanceTypes;
  }[];
}

export interface HomeState {
  schedule: DNDSchedule;
  major?: Major;
  currentClassCounter: number; // used for DND purposes, every class needs a unique ID
  chooseMajorModalVisible: boolean;
  warnings: IWarning[];
}

type Props = HomeProps & RouteComponentProps;

class HomeComponent extends React.Component<Props, HomeState> {
  constructor(props: Props) {
    super(props);

    const userData: IUserData = props.location.state.userData;

    this.state = {
      schedule: mockData,
      major: userData.major,
      currentClassCounter: 0,
      chooseMajorModalVisible: false,
      warnings: [],
    };

    if (!!userData.major) {
      this.setSchedule(plans[userData.major.name][0]);
    }
  }

  onDragEnd = (result: any) => {
    const { destination, source } = result;

    const newState = moveCourse(this.state, destination, source);

    if (newState) {
      this.setState(newState, () => {
        this.updateWarnings(newState);
      });
    }
  };

  onDragUpdate = (update: any) => {
    const { destination } = update;
    if (!destination || !destination.droppableId) return;

    const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
    const destSemesterYear = convertTermIdToYear(destination.droppableId);
    const destYear: DNDScheduleYear = this.state.schedule.yearMap[
      destSemesterYear
    ];
    const destSemester: DNDScheduleTerm = (destYear as any)[destSemesterSeason];

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

      this.updateSemester(destSemesterYear, destSemesterSeason, destSemester);
    }
  };

  removeHovers(currSemester: DNDScheduleTerm) {
    for (const yearnum of this.state.schedule.years) {
      const year = this.state.schedule.yearMap[yearnum];
      console.log(year.summer1.status.toString());
      if (isCoopOrVacation(year.fall) && year.fall !== currSemester) {
        year.fall.status = year.fall.status.replace("HOVER", "") as Status;
        this.updateSemester(yearnum, "fall", year.fall);
      }
      if (isCoopOrVacation(year.spring) && year.spring !== currSemester) {
        year.spring.status = year.spring.status.replace("HOVER", "") as Status;
        this.updateSemester(yearnum, "spring", year.spring);
      }
      if (isCoopOrVacation(year.summer1) && year.summer1 !== currSemester) {
        year.summer1.status = year.summer1.status.replace(
          "HOVER",
          ""
        ) as Status;
        this.updateSemester(yearnum, "summer1", year.summer1);
      }
      if (isCoopOrVacation(year.summer2) && year.summer2 !== currSemester) {
        year.summer2.status = year.summer2.status.replace(
          "HOVER",
          ""
        ) as Status;
        this.updateSemester(yearnum, "summer2", year.summer2);
      }
    }
  }

  updateSemester(
    yearnum: number,
    season: string,
    updatedSemester: DNDScheduleTerm
  ) {
    const newState: HomeState = {
      ...this.state,
      schedule: {
        ...this.state.schedule,
        yearMap: {
          ...this.state.schedule.yearMap,
          [yearnum]: {
            ...this.state.schedule.yearMap[yearnum],
            [season]: updatedSemester,
          },
        },
      },
    };

    this.setState(newState);
  }

  updateWarnings(newState: HomeState) {
    const warnings = produceWarnings(newState.schedule);
    this.setState({
      warnings: warnings,
    });

    // remove existing toasts
    this.props.toastStack.forEach(t => this.props.removeToast(t.id));

    // add new toasts
    warnings.forEach(w => {
      this.props.addToast(w.message, {
        appearance: "warning",
      });
    });
  }

  onChooseMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = majors.find((m: any) => m.name === value);

    if (!!maj) {
      this.setState({ chooseMajorModalVisible: true, major: maj });
    } else {
      this.setState({ major: maj });
    }
  }

  handleAddClasses = async (courses: ScheduleCourse[], termId: number) => {
    // convert to DNDScheduleCourses
    const [dndCourses, counter] = await convertToDNDCourses(
      courses,
      this.state.currentClassCounter
    );
    const year = convertTermIdToYear(termId);
    const season = convertTermIdToSeason(termId);

    const newState = addClassToSchedule(
      this.state,
      year,
      season,
      counter,
      dndCourses
    );

    this.setState(newState, () => {
      this.updateWarnings(newState);
    });
  };

  async setSchedule(schedule: Schedule) {
    const [dndSchedule, counter] = await convertToDNDSchedule(
      schedule,
      this.state.currentClassCounter
    );
    const newState: HomeState = {
      ...this.state,
      schedule: dndSchedule,
      currentClassCounter: counter,
    };
    this.setState(newState, () => {
      this.updateWarnings(newState);
    });
  }

  hideChooseMajorPlanModal() {
    this.setState({ chooseMajorModalVisible: false });
  }

  handleStatusChange(
    newStatus: Status,
    tappedSemester: SeasonWord,
    year: number
  ) {
    const semester = this.state.schedule.yearMap[year][tappedSemester];
    if (newStatus === "INACTIVE" && semester.classes.length !== 0) {
      // show dialog
    }
    this.setState({
      ...this.state,
      schedule: {
        ...this.state.schedule,
        yearMap: {
          ...this.state.schedule.yearMap,
          [year]: {
            ...this.state.schedule.yearMap[year],
            [tappedSemester]: {
              ...this.state.schedule.yearMap[year][tappedSemester],
              status: newStatus,
            },
          },
        },
      },
    });
  }

  renderMajorDropDown() {
    return (
      <Autocomplete
        style={{ width: 300 }}
        disableListWrap
        options={majors.map(maj => maj.name)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Major"
            fullWidth
          />
        )}
        value={!!this.state.major ? this.state.major.name + " " : ""}
        onChange={this.onChooseMajor.bind(this)}
      />
    );
  }

  renderYears() {
    return this.state.schedule.years.map((year: number, index: number) => (
      <Year
        key={index}
        index={index}
        schedule={this.state.schedule}
        handleAddClasses={this.handleAddClasses.bind(this)}
        handleStatusChange={this.handleStatusChange.bind(this)}
      />
    ));
  }

  render() {
    return (
      <OuterContainer>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragUpdate={this.onDragUpdate}
        >
          <ChooseMajorPlanModal
            visible={this.state.chooseMajorModalVisible}
            handleClose={this.hideChooseMajorPlanModal.bind(this)}
            handleSubmit={this.setSchedule.bind(this)}
            major={this.state.major!}
          />
          <Container>
            <div onClick={() => console.log(this.state)}>
              <h2>Plan Of Study</h2>
            </div>
            {this.renderMajorDropDown()}
            <CompletedCoursesWrapper>
              <h3>Completed Courses</h3>
              <DropDownModal schedule={this.state.schedule} />
            </CompletedCoursesWrapper>
            {this.renderYears()}
          </Container>
        </DragDropContext>
        <Sidebar schedule={this.state.schedule} major={this.state.major} />
      </OuterContainer>
    );
  }
}

export const Home = withRouter(withToast(HomeComponent));
