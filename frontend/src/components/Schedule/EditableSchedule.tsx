import React from "react";
import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import { Sidebar } from "../Sidebar";
import { AppState } from "../../state/reducers/state";
import {
  convertTermIdToYear,
  convertTermIdToSeason,
  isCoopOrVacation,
  moveCourse,
  addCourseFromSidebar,
  convertToDNDSchedule,
} from "../../utils";
import {
  Schedule,
  Major,
  Status,
  SeasonWord,
  ScheduleCourse,
} from "../../../../common/types";
import {
  DNDSchedule,
  IWarning,
  DNDScheduleYear,
  DNDScheduleTerm,
  IPlanData,
  ScheduleSlice,
  NamedSchedule,
} from "../../models/types";
import {
  updateSemesterAction,
  setDNDScheduleAction,
  setClosedYearsToYearsInThePast,
  incrementCurrentClassCounter,
} from "../../state/actions/scheduleActions";
import {
  getScheduleFromState,
  getCurrentClassCounterFromState,
} from "../../state";
import ScheduleComponent from "./Schedule";

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

interface Props {
  sidebarPresent: boolean;
  transferCreditPresent: boolean;
}

export const EditableSchedule: React.FC<Props> = props => {
  const { schedule, currentClassCounter } = useSelector(
    (state: AppState) => ({
      schedule: getScheduleFromState(state),
      currentClassCounter: getCurrentClassCounterFromState(state),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const updateSemester = (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => dispatch(updateSemesterAction(year, season, newSemester));
  const setDNDSchedule = (schedule: DNDSchedule): any =>
    dispatch(setDNDScheduleAction(schedule));

  const incrementCurrentClassCounter = (): any =>
    dispatch(incrementCurrentClassCounter());

  const removeHovers = (currSemester: DNDScheduleTerm) => {
    for (const yearnum of schedule.years) {
      const year = JSON.parse(JSON.stringify(schedule.yearMap[yearnum])); // deep copy
      if (isCoopOrVacation(year.fall) && year.fall !== currSemester) {
        year.fall.status = year.fall.status.replace("HOVER", "") as Status;
        updateSemester(yearnum, "fall", year.fall);
      }
      if (isCoopOrVacation(year.spring) && year.spring !== currSemester) {
        year.spring.status = year.spring.status.replace("HOVER", "") as Status;
        updateSemester(yearnum, "spring", year.spring);
      }
      if (isCoopOrVacation(year.summer1) && year.summer1 !== currSemester) {
        year.summer1.status = year.summer1.status.replace(
          "HOVER",
          ""
        ) as Status;
        updateSemester(yearnum, "summer1", year.summer1);
      }
      if (isCoopOrVacation(year.summer2) && year.summer2 !== currSemester) {
        year.summer2.status = year.summer2.status.replace(
          "HOVER",
          ""
        ) as Status;
        updateSemester(yearnum, "summer2", year.summer2);
      }
    }
  };

  const onDragUpdate = (update: any) => {
    const { destination, source } = update;

    if (isNaN(Number(source.droppableId))) {
      return;
    }

    if (!destination || !destination.droppableId) return;

    const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
    const destSemesterYear = convertTermIdToYear(destination.droppableId);
    const destYear: DNDScheduleYear = schedule.yearMap[destSemesterYear];
    const destSemester: DNDScheduleTerm = JSON.parse(
      JSON.stringify((destYear as any)[destSemesterSeason])
    ); // deep copy

    removeHovers(destSemester);

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

      updateSemester(destSemesterYear, destSemesterSeason, destSemester);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // if drag is coming from the sidebar
    if (isNaN(Number(source.droppableId))) {
      addCourseFromSidebar(
        schedule,
        destination,
        source,
        setDNDSchedule,
        draggableId,
        currentClassCounter
      );
      incrementCurrentClassCounter();
    } else {
      moveCourse(schedule, destination, source, setDNDSchedule);
    }
  };

  return (
    <OuterContainer>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <LeftScroll className="hide-scrollbar">
          <Container>
            {props.children}
            <ScheduleComponent schedule={schedule} />
            {/* {this.renderTransfer()} */}
          </Container>
        </LeftScroll>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
      </DragDropContext>
    </OuterContainer>
  );
};
