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
} from "../../utils";
import { Status, SeasonWord } from "../../../../common/types";
import {
  DNDSchedule,
  DNDScheduleYear,
  DNDScheduleTerm,
} from "../../models/types";
import {
  updateSemesterForActivePlanAction,
  setActivePlanDNDScheduleAction,
  incrementCurrentClassCounterForActivePlanAction,
} from "../../state/actions/userPlansActions";
import {
  safelyGetActivePlanFromState,
  getCurrentClassCounterFromState,
  getTransferCoursesFromState,
} from "../../state";
import { Year } from "../Year";
import Loader from "react-loader-spinner";
import { TransferCredits } from "../TransferCreditHolder";

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

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;
`;

interface ScheduleProps {
  readonly schedule?: DNDSchedule;
}

const LoadingSpinner: React.FC = () => {
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
};

const ScheduleComponent: React.FC<ScheduleProps> = ({ schedule }) => {
  return schedule ? (
    <>
      {schedule.years.map((year: number, index: number) => (
        <Year key={index} index={index} schedule={schedule} />
      ))}
    </>
  ) : (
    <LoadingSpinner />
  );
};

export const EditableSchedule: React.FC<Props> = props => {
  const { children, sidebarPresent, transferCreditPresent } = props;
  const { activePlan, currentClassCounter, transferCredits } = useSelector(
    (state: AppState) => ({
      activePlan: safelyGetActivePlanFromState(state)!.schedule,
      currentClassCounter: getCurrentClassCounterFromState(state),
      transferCredits: getTransferCoursesFromState(state),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const updateSemester = (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm
  ) => dispatch(updateSemesterForActivePlanAction(year, season, newSemester));
  const setDNDSchedule = (schedule: DNDSchedule): any =>
    dispatch(setActivePlanDNDScheduleAction(schedule));

  const incrementCurrentClassCounter = (): any =>
    dispatch(incrementCurrentClassCounterForActivePlanAction());

  const removeHovers = (currSemester: DNDScheduleTerm) => {
    for (const yearnum of activePlan.years) {
      const year = JSON.parse(JSON.stringify(activePlan.yearMap[yearnum])); // deep copy
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
    const destYear: DNDScheduleYear = activePlan.yearMap[destSemesterYear];
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
        activePlan,
        destination,
        source,
        setDNDSchedule,
        draggableId,
        currentClassCounter
      );
      incrementCurrentClassCounter();
    } else {
      moveCourse(activePlan, destination, source, setDNDSchedule);
    }
  };

  return (
    <OuterContainer>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <LeftScroll className="hide-scrollbar">
          <Container>
            {children}
            <ScheduleComponent schedule={activePlan} />
            {transferCreditPresent && (
              <TransferCredits transferCredits={transferCredits} />
            )}
          </Container>
        </LeftScroll>
        {sidebarPresent && (
          <SidebarContainer>
            <Sidebar />
          </SidebarContainer>
        )}
      </DragDropContext>
    </OuterContainer>
  );
};
