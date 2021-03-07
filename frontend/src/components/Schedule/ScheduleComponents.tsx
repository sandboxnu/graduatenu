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
  getCurrentClassCounterFromState,
  getActivePlanFromState,
  safelyGetTransferCoursesFromState,
  safelyGetUserIdFromState,
} from "../../state";
import { Year } from "../Year";
import { TransferCredits } from "../TransferCreditHolder";
import { LoadingSpinner } from "../common/LoadingSpinner";
import ScheduleChangeTracker from "../../utils/ScheduleChangeTracker";
import { Comments } from "./Comments";

const OuterContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const SidebarContainer = styled.div`
  height: calc(100vh - 85px);
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 4;
  position: relative;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
`;

const LeftScroll = styled.div<any>`
  height: ${props => (props.sidebarPresent ? "calc(100vh - 85px)" : "auto")};
  overflow-x: hidden;
  overflow-y: scroll;
  flex: 19;
  margin-bottoom: 30px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
  background-color: "#ff76ff";
`;

interface Props {
  sidebarPresent?: boolean;
  transferCreditPresent?: boolean;
  collapsibleYears: boolean;
  commentsPresent?: boolean;
}

interface ScheduleProps {
  readonly schedule?: DNDSchedule;
  readonly isEditable: boolean;
  readonly collapsibleYears: boolean;
}

interface NonEditableProps {
  schedule?: DNDSchedule;
}

const ScheduleComponent: React.FC<ScheduleProps> = ({
  schedule,
  isEditable,
  collapsibleYears,
}) => {
  return schedule !== undefined ? (
    <>
      {schedule.years.map((year: number, index: number) => (
        <Year
          key={index}
          index={index}
          schedule={schedule}
          isEditable={isEditable}
          collapsibleYears={collapsibleYears}
        />
      ))}
    </>
  ) : (
    <LoadingSpinner isTall />
  );
};

export const NonEditableSchedule: React.FC = () => {
  const { activePlan, transferCredits } = useSelector(
    (state: AppState) => ({
      activePlan: getActivePlanFromState(state)?.schedule,
      transferCredits: safelyGetTransferCoursesFromState(state),
    }),
    shallowEqual
  );
  return (
    <>
      <ScheduleComponent
        schedule={activePlan}
        isEditable={false}
        collapsibleYears={false}
      />
      <TransferCredits transferCredits={transferCredits} isEditable={false} />
    </>
  );
};

export const NonEditableScheduleStudentView: React.FC<Props> = props => {
  const {
    children,
    sidebarPresent,
    transferCreditPresent,
    collapsibleYears,
    commentsPresent,
  } = props;
  const { activePlan, transferCredits, planId, userId } = useSelector(
    (state: AppState) => ({
      activePlan: getActivePlanFromState(state)!.schedule,
      transferCredits: safelyGetTransferCoursesFromState(state),
      planId: getActivePlanFromState(state)!.id,
      userId: commentsPresent ? safelyGetUserIdFromState(state) : null,
    }),
    shallowEqual
  );

  return (
    <OuterContainer>
      {sidebarPresent && (
        <SidebarContainer>
          <Sidebar isEditable={false} />
        </SidebarContainer>
      )}
      <LeftScroll className="hide-scrollbar" sidebarPresent={sidebarPresent}>
        <Container>
          {children}
          <ScheduleComponent
            schedule={activePlan}
            isEditable={false}
            collapsibleYears={collapsibleYears}
          />
          {transferCreditPresent && (
            <TransferCredits
              transferCredits={transferCredits}
              isEditable={false}
            />
          )}
        </Container>
        {commentsPresent && <Comments planId={planId} studentId={userId!} />}
      </LeftScroll>
    </OuterContainer>
  );
};

export const EditableSchedule: React.FC<Props> = props => {
  const {
    children,
    sidebarPresent,
    transferCreditPresent,
    collapsibleYears,
    commentsPresent,
  } = props;
  const {
    activePlan,
    currentClassCounter,
    transferCredits,
    planId,
    userId,
  } = useSelector(
    (state: AppState) => ({
      activePlan: getActivePlanFromState(state)!.schedule,
      planId: getActivePlanFromState(state)!.id,
      currentClassCounter: getCurrentClassCounterFromState(state),
      transferCredits: safelyGetTransferCoursesFromState(state),
      userId: commentsPresent ? safelyGetUserIdFromState(state) : null,
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

  const ChangeTracker = ScheduleChangeTracker.getInstance();

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
    if (!destination) return;

    if (isNaN(Number(source.droppableId))) {
      addCourseFromSidebar(
        activePlan,
        destination,
        source,
        setDNDSchedule,
        draggableId,
        currentClassCounter
      );
      ChangeTracker.addMoveClassChange(
        draggableId
          .split(" ")
          .slice(0, 2)
          .join(""),
        true,
        destination.droppableId
      );
      incrementCurrentClassCounter();
    } else {
      ChangeTracker.addMoveClassChange(
        draggableId
          .split(" ")
          .slice(0, 2)
          .join(""),
        false,
        destination.droppableId,
        source.drooppableId
      );
      moveCourse(activePlan, destination, source, setDNDSchedule);
    }
  };

  return (
    <OuterContainer>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        {sidebarPresent && (
          <SidebarContainer>
            <Sidebar isEditable={true} />
          </SidebarContainer>
        )}
        <LeftScroll className="hide-scrollbar" sidebarPresent={sidebarPresent}>
          <Container>
            {children}
            <ScheduleComponent
              schedule={activePlan}
              isEditable={true}
              collapsibleYears={collapsibleYears}
            />
            {transferCreditPresent && (
              <TransferCredits
                transferCredits={transferCredits}
                isEditable={true}
              />
            )}
          </Container>
          {commentsPresent && <Comments planId={planId} studentId={userId!} />}
        </LeftScroll>
      </DragDropContext>
    </OuterContainer>
  );
};
