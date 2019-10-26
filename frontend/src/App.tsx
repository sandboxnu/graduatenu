import React from "react";
import "./App.css";
import { DragDropContext } from "react-beautiful-dnd";
import { mockData } from "./data/mockData";
import { ScheduleTerm, Schedule, ScheduleYear } from "./models/types";
import styled from "styled-components";
import { Year } from "./components/Year/Year";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 30px;
  background-color: "#ff76ff";
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
`;

const Button = styled.button`
	width: 100px;
	border 1px solid black;
	padding: 8px;
	margin-right: 20px;
`;

const ButtonText = styled.div`
  text-align: center;
`;

interface AppState {
  schedule: Schedule;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = { schedule: mockData };
  }

  onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // const startSemester = this.state.schedule.semesters[source.droppableId];
    const sourceDrop = source.droppableId.split(" ");
    const startYear: ScheduleYear = this.state.schedule.yearMap[sourceDrop[1]];
    const startSemester: ScheduleTerm = (startYear as any)[sourceDrop[0]];

    const destDrop = destination.droppableId.split(" ");
    const finishYear: ScheduleYear = this.state.schedule.yearMap[destDrop[1]];
    const finishSemester: ScheduleTerm = (finishYear as any)[destDrop[0]];

    if (startSemester === finishSemester) {
      const newClassOrder = Array.from(startSemester.classes);
      const movedClass = newClassOrder[source.index];
      newClassOrder.splice(source.index, 1);
      newClassOrder.splice(destination.index, 0, movedClass);

      const newSemester: ScheduleTerm = {
        ...startSemester,
        classes: newClassOrder,
      };

      const newState: AppState = {
        ...this.state,
        schedule: {
          ...this.state.schedule,
          // semesters: {
          //   ...this.state.schedule.semesters,
          //   [newSemester.id]: newSemester,
          // },
          yearMap: {
            ...this.state.schedule.yearMap,
            [Number(newSemester.id.split(" ")[1])]: {
              ...this.state.schedule.yearMap[
                Number(newSemester.id.split(" ")[1])
              ],
              [newSemester.id.split(" ")[0]]: newSemester,
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
    const newStartSemester: ScheduleTerm = {
      ...startSemester,
      classes: startClasses,
    };

    const finishClasses = Array.from(finishSemester.classes);
    finishClasses.splice(destination.index, 0, movedClass);
    const newFinishSemester: ScheduleTerm = {
      ...finishSemester,
      classes: finishClasses,
    };

    let newState: AppState;

    if (
      Number(newStartSemester.id.split(" ")[1]) ===
      Number(newFinishSemester.id.split(" ")[1])
    ) {
      // in same year
      newState = {
        ...this.state,
        schedule: {
          ...this.state.schedule,
          yearMap: {
            ...this.state.schedule.yearMap,
            [Number(newStartSemester.id.split(" ")[1])]: {
              ...this.state.schedule.yearMap[
                Number(newStartSemester.id.split(" ")[1])
              ],
              [newStartSemester.id.split(" ")[0]]: newStartSemester,
              [newFinishSemester.id.split(" ")[0]]: newFinishSemester,
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
            [Number(newStartSemester.id.split(" ")[1])]: {
              ...this.state.schedule.yearMap[
                Number(newStartSemester.id.split(" ")[1])
              ],
              [newStartSemester.id.split(" ")[0]]: newStartSemester,
            },
            [Number(newFinishSemester.id.split(" ")[1])]: {
              ...this.state.schedule.yearMap[
                Number(newFinishSemester.id.split(" ")[1])
              ],
              [newFinishSemester.id.split(" ")[0]]: newFinishSemester,
            },
          },
        },
      };
    }

    console.log(" ");
    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          <div>
            <h2>Plan Of Study</h2>
          </div>
          <ButtonWrapper>
            <Button onClick={() => {}}>
              <ButtonText>Add a class</ButtonText>
            </Button>
            <Button onClick={() => {}}>
              <ButtonText>Search</ButtonText>
            </Button>
          </ButtonWrapper>
          <Year index={0} schedule={this.state.schedule}></Year>
          <Year index={1} schedule={this.state.schedule}></Year>
          {/* <Year index={2} schedule={this.state.schedule}></Year>
					<Year index={3} schedule={this.state.schedule}></Year> */}
        </Container>
      </DragDropContext>
    );
  }
}
