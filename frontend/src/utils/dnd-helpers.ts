import { HomeState } from "../home/Home";
import { convertTermIdToSeason, convertTermIdToYear } from "./schedule-helpers";
import { DNDScheduleYear, DNDScheduleTerm, DNDSchedule } from "../models/types";

export function moveCourse(
  state: HomeState,
  destination: any,
  source: any
): HomeState | undefined {
  if (
    !destination ||
    (destination.droppableId === source.droppableId &&
      destination.index === source.index)
  ) {
    return undefined;
  }

  const sourceSemesterSeason = convertTermIdToSeason(source.droppableId);
  const sourceSemesterYear = convertTermIdToYear(source.droppableId);
  const startYear: DNDScheduleYear = state.schedule.yearMap[sourceSemesterYear];
  const startSemester: DNDScheduleTerm = (startYear as any)[
    sourceSemesterSeason
  ];

  const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
  const destSemesterYear = convertTermIdToYear(destination.droppableId);
  const finishYear: DNDScheduleYear = state.schedule.yearMap[destSemesterYear];
  const finishSemester: DNDScheduleTerm = (finishYear as any)[
    destSemesterSeason
  ];

  var newState: HomeState;

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

    newState = {
      ...state,
      schedule: {
        ...state.schedule,
        yearMap: {
          ...state.schedule.yearMap,
          [newSemesterYear]: {
            ...state.schedule.yearMap[newSemesterYear],
            [newSemesterSeason]: newSemester,
          },
        },
      },
    };
  } else {
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

    if (
      newFinishSemester.status === "INACTIVE" ||
      newFinishSemester.status === "HOVERINACTIVE" ||
      newFinishSemester.status === "COOP" ||
      newFinishSemester.status === "HOVERCOOP"
    ) {
      newFinishSemester.status = "CLASSES";
    }

    if (newStartSemesterYear === newFinishSemesterYear) {
      // in same year
      newState = {
        ...state,
        schedule: {
          ...state.schedule,
          yearMap: {
            ...state.schedule.yearMap,
            [newStartSemesterYear]: {
              ...state.schedule.yearMap[newStartSemesterYear],
              [newStartSemesterSeason]: newStartSemester,
              [newFinishSemesterSeason]: newFinishSemester,
            },
          },
        },
      };
    } else {
      newState = {
        ...state,
        schedule: {
          ...state.schedule,
          yearMap: {
            ...state.schedule.yearMap,
            [newStartSemesterYear]: {
              ...state.schedule.yearMap[newStartSemesterYear],
              [newStartSemesterSeason]: newStartSemester,
            },
            [newFinishSemesterYear]: {
              ...state.schedule.yearMap[newFinishSemesterYear],
              [newFinishSemesterSeason]: newFinishSemester,
            },
          },
        },
      };
    }
  }

  return newState;
}
