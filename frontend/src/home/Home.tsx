import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { mockData } from "../data/mockData";
import {
  DNDScheduleTerm,
  DNDSchedule,
  DNDScheduleYear,
  Major,
  DNDScheduleCourse,
  NamedScheduleCourse,
  Schedule,
  Status,
  SeasonWord,
} from "../models/types";
import styled from "styled-components";
import { Year } from "../components/Year/Year";
import { convertTermIdToYear, convertTermIdToSeason } from "../utils";
import { TextField, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { majors } from "../majors";
import { ChooseMajorPlanModal } from "../components/ChooseMajorPlanModal";
import { Link } from "react-router-dom";

const OuterContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
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

interface AppState {
  schedule: DNDSchedule;
  major?: Major;
  currentClassCounter: number; // used for DND purposes, every class needs a unique ID
  chooseMajorModalVisible: boolean;
  toOnboarding: boolean;
}

export class Home extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      schedule: mockData,
      major: undefined,
      currentClassCounter: 0,
      chooseMajorModalVisible: false,
      toOnboarding: true,
    };
  }

  onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const sourceSemesterSeason = convertTermIdToSeason(source.droppableId);
    const sourceSemesterYear = convertTermIdToYear(source.droppableId);
    const startYear: DNDScheduleYear = this.state.schedule.yearMap[
      sourceSemesterYear
    ];
    const startSemester: DNDScheduleTerm = (startYear as any)[
      sourceSemesterSeason
    ];

    const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
    const destSemesterYear = convertTermIdToYear(destination.droppableId);
    const finishYear: DNDScheduleYear = this.state.schedule.yearMap[
      destSemesterYear
    ];
    const finishSemester: DNDScheduleTerm = (finishYear as any)[
      destSemesterSeason
    ];

    if (startSemester === finishSemester) {
      const newClassOrder = Array.from(startSemester.classes);
      const movedClass = newClassOrder[source.index];
      newClassOrder.splice(source.index, 1);
      newClassOrder.splice(destination.index, 0, movedClass);

      const newSemester: DNDScheduleTerm = {
        ...startSemester,
        classes: newClassOrder,
      };

      const newSemesterYear = convertTermIdToYear(newSemester.termId);
      const newSemesterSeason = convertTermIdToSeason(newSemester.termId);

      const newState: AppState = {
        ...this.state,
        schedule: {
          ...this.state.schedule,
          yearMap: {
            ...this.state.schedule.yearMap,
            [newSemesterYear]: {
              ...this.state.schedule.yearMap[newSemesterYear],
              [newSemesterSeason]: newSemester,
            },
          },
        },
      };

      this.setState(newState);
      return;
    }

    const startClasses = Array.from(startSemester.classes);
    const movedClass = startClasses[source.index];
    startClasses.splice(source.index, 1);
    const newStartSemester: DNDScheduleTerm = {
      ...startSemester,
      classes: startClasses,
    };

    const finishClasses = Array.from(finishSemester.classes);
    finishClasses.splice(destination.index, 0, movedClass);
    const newFinishSemester: DNDScheduleTerm = {
      ...finishSemester,
      classes: finishClasses,
    };

    const newStartSemesterYear = convertTermIdToYear(newStartSemester.termId);
    const newStartSemesterSeason = convertTermIdToSeason(
      newStartSemester.termId
    );
    const newFinishSemesterYear = convertTermIdToYear(newFinishSemester.termId);
    const newFinishSemesterSeason = convertTermIdToSeason(
      newFinishSemester.termId
    );

    let newState: AppState;

    if (newStartSemesterYear === newFinishSemesterYear) {
      // in same year
      newState = {
        ...this.state,
        schedule: {
          ...this.state.schedule,
          yearMap: {
            ...this.state.schedule.yearMap,
            [newStartSemesterYear]: {
              ...this.state.schedule.yearMap[newStartSemesterYear],
              [newStartSemesterSeason]: newStartSemester,
              [newFinishSemesterSeason]: newFinishSemester,
            },
          },
        },
      };
    } else {
      newState = {
        ...this.state,
        schedule: {
          ...this.state.schedule,
          yearMap: {
            ...this.state.schedule.yearMap,
            [newStartSemesterYear]: {
              ...this.state.schedule.yearMap[newStartSemesterYear],
              [newStartSemesterSeason]: newStartSemester,
            },
            [newFinishSemesterYear]: {
              ...this.state.schedule.yearMap[newFinishSemesterYear],
              [newFinishSemesterSeason]: newFinishSemester,
            },
          },
        },
      };
    }

    this.setState(newState);
  };

  renderYears() {
    return this.state.schedule.years.map((year: number, index: number) => (
      <Year
        index={index}
        schedule={this.state.schedule}
        handleAddClasses={this.handleAddClasses.bind(this)}
        handleStatusChange={this.handleStatusChange.bind(this)}
      />
    ));
  }

  onChooseMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = majors.find((m: any) => m.name === value);

    if (!!maj) {
      this.setState({ chooseMajorModalVisible: true, major: maj });
    } else {
      this.setState({ major: maj });
    }
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

  handleAddClasses = async (courses: NamedScheduleCourse[], termId: number) => {
    // convert to DNDScheduleCourses
    const dndCourses = await this.convertToDNDCourses(courses);
    const year = convertTermIdToYear(termId);
    const season = convertTermIdToSeason(termId);

    this.setState({
      ...this.state,
      schedule: {
        ...this.state.schedule,
        yearMap: {
          ...this.state.schedule.yearMap,
          [year]: {
            ...this.state.schedule.yearMap[year],
            [season]: {
              ...(this.state.schedule.yearMap[year] as any)[season],
              classes: [
                ...(this.state.schedule.yearMap[year] as any)[season].classes,
                ...dndCourses,
              ],
            },
          },
        },
      },
    });
  };

  convertToDNDCourses = async (
    courses: NamedScheduleCourse[]
  ): Promise<DNDScheduleCourse[]> => {
    var list: DNDScheduleCourse[] = [];
    var counter = this.state.currentClassCounter;
    for (const course of courses) {
      counter++;
      list.push({
        ...course,
        dndId: String(counter),
      });
    }
    await this.setState({
      currentClassCounter: counter,
    });
    return list;
  };

  convertToDNDSchedule = async (schedule: Schedule): Promise<DNDSchedule> => {
    const newSchedule = schedule as DNDSchedule;
    for (const year of Object.keys(schedule.yearMap)) {
      newSchedule.yearMap[
        year as any
      ].fall.classes = await this.convertToDNDCourses(newSchedule.yearMap[
        year as any
      ].fall.classes as NamedScheduleCourse[]);
      newSchedule.yearMap[
        year as any
      ].spring.classes = await this.convertToDNDCourses(newSchedule.yearMap[
        year as any
      ].spring.classes as NamedScheduleCourse[]);
      newSchedule.yearMap[
        year as any
      ].summer1.classes = await this.convertToDNDCourses(newSchedule.yearMap[
        year as any
      ].summer1.classes as NamedScheduleCourse[]);
      newSchedule.yearMap[
        year as any
      ].summer2.classes = await this.convertToDNDCourses(newSchedule.yearMap[
        year as any
      ].summer2.classes as NamedScheduleCourse[]);
    }
    return newSchedule;
  };

  async setSchedule(schedule: Schedule) {
    const dndSchedule = await this.convertToDNDSchedule(schedule);
    this.setState({ schedule: dndSchedule });
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

  render() {
    return (
      <OuterContainer>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <ChooseMajorPlanModal
            visible={this.state.chooseMajorModalVisible}
            handleClose={this.hideChooseMajorPlanModal.bind(this)}
            handleSubmit={this.setSchedule.bind(this)}
            major={this.state.major!}
          ></ChooseMajorPlanModal>
          <Container>
            <div onClick={() => console.log(this.state)}>
              <h2>Plan Of Study</h2>
            </div>
            {this.renderMajorDropDown()}
            {this.renderYears()}
          </Container>
        </DragDropContext>
      </OuterContainer>
    );
  }
}
