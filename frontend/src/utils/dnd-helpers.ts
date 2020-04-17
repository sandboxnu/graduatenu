import { convertTermIdToSeason, convertTermIdToYear } from ".";
import {
  DNDScheduleYear,
  DNDScheduleTerm,
  DNDSchedule,
  ICompletedCoursesMap,
} from "../models/types";
import { DraggableLocation } from "react-beautiful-dnd";
import { getIndexFromCompletedCoursesDNDID } from "./completed-courses-helpers";
export const COMPLETED_COURSES_AREA_DROPPABLE_ID = "completed-courses-dropdown";
// WIll need to work on this

export function moveCourse(
  schedule: DNDSchedule,
  destination: any,
  source: any,
  setSchedule: (schedule: DNDSchedule) => void
) {
  if (
    !destination ||
    (destination.droppableId === source.droppableId &&
      destination.index === source.index)
  ) {
    return undefined;
  }

  const sourceSemesterSeason = convertTermIdToSeason(source.droppableId);
  const sourceSemesterYear = convertTermIdToYear(source.droppableId);
  const startYear: DNDScheduleYear = schedule.yearMap[sourceSemesterYear];
  const startSemester: DNDScheduleTerm = (startYear as any)[
    sourceSemesterSeason
  ];

  const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
  const destSemesterYear = convertTermIdToYear(destination.droppableId);
  const finishYear: DNDScheduleYear = schedule.yearMap[destSemesterYear];
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

    setSchedule({
      ...schedule,
      yearMap: {
        ...schedule.yearMap,
        [newSemesterYear]: {
          ...schedule.yearMap[newSemesterYear],
          [newSemesterSeason]: newSemester,
        },
      },
    });
    return;
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
      setSchedule({
        ...schedule,
        yearMap: {
          ...schedule.yearMap,
          [newStartSemesterYear]: {
            ...schedule.yearMap[newStartSemesterYear],
            [newStartSemesterSeason]: newStartSemester,
            [newFinishSemesterSeason]: newFinishSemester,
          },
        },
      });
      return;
    } else {
      setSchedule({
        ...schedule,
        yearMap: {
          ...schedule.yearMap,
          [newStartSemesterYear]: {
            ...schedule.yearMap[newStartSemesterYear],
            [newStartSemesterSeason]: newStartSemester,
          },
          [newFinishSemesterYear]: {
            ...schedule.yearMap[newFinishSemesterYear],
            [newFinishSemesterSeason]: newFinishSemester,
          },
        },
      });
      return;
    }
  }
}

export function moveCourseInSameCompletedCoursesSection(
  completedCourses: ICompletedCoursesMap,
  destination: DraggableLocation,
  source: DraggableLocation,
  setCompletedCourses: (courses: ICompletedCoursesMap) => void
) {
  const completedCoursesCopy = { ...completedCourses };

  const idx = getIndexFromCompletedCoursesDNDID(source.droppableId);

  const newClassOrder = Array.from(completedCourses[idx]);
  const movedClass = newClassOrder[source.index];
  newClassOrder.splice(source.index, 1);
  newClassOrder.splice(destination.index, 0, movedClass);
  completedCoursesCopy[idx] = newClassOrder;

  setCompletedCourses(completedCoursesCopy);
}

export function moveCourseInCompletedCourses(
  completedCourses: ICompletedCoursesMap,
  destination: DraggableLocation,
  source: DraggableLocation,
  setCompletedCourses: (courses: ICompletedCoursesMap) => void
) {
  const completedCoursesCopy = { ...completedCourses };

  const sourceIdx = getIndexFromCompletedCoursesDNDID(source.droppableId);
  const destIdx = getIndexFromCompletedCoursesDNDID(destination.droppableId);

  const startClasses = Array.from(completedCourses[sourceIdx]);
  const movedClass = startClasses[source.index];
  startClasses.splice(source.index, 1);
  completedCoursesCopy[sourceIdx] = startClasses;

  const finishClasses = Array.from(completedCourses[destIdx]);
  finishClasses.splice(destination.index, 0, movedClass);
  completedCoursesCopy[destIdx] = finishClasses;

  setCompletedCourses(completedCoursesCopy);
}

export function moveCourseToCompletedCourses(
  completedCourses: ICompletedCoursesMap,
  destination: DraggableLocation,
  source: DraggableLocation,
  schedule: DNDSchedule,
  setDNDSchedule: (schedule: DNDSchedule) => void,
  setCompletedCourses: (courses: ICompletedCoursesMap) => void
) {
  const completedCoursesCopy = { ...completedCourses };

  const destIdx = getIndexFromCompletedCoursesDNDID(destination.droppableId);

  const sourceSemesterSeason = convertTermIdToSeason(
    Number(source.droppableId)
  );
  const sourceSemesterYear = convertTermIdToYear(Number(source.droppableId));
  const startYear: DNDScheduleYear = schedule.yearMap[sourceSemesterYear];
  const startSemester: DNDScheduleTerm = (startYear as any)[
    sourceSemesterSeason
  ];

  const startClasses = Array.from(startSemester.classes);
  const movedClass = startClasses[source.index];
  startClasses.splice(source.index, 1);
  const newStartSemester: DNDScheduleTerm = {
    ...startSemester,
    classes: startClasses,
  };

  const finishClasses = Array.from(completedCourses[destIdx]);
  finishClasses.splice(destination.index, 0, movedClass);
  completedCoursesCopy[destIdx] = finishClasses;

  const newStartSemesterYear = convertTermIdToYear(newStartSemester.termId);
  const newStartSemesterSeason = convertTermIdToSeason(newStartSemester.termId);

  setCompletedCourses(completedCoursesCopy);
  setDNDSchedule({
    ...schedule,
    yearMap: {
      ...schedule.yearMap,
      [newStartSemesterYear]: {
        ...schedule.yearMap[newStartSemesterYear],
        [newStartSemesterSeason]: newStartSemester,
      },
    },
  });
}

export function moveCourseFromCompletedCourses(
  completedCourses: ICompletedCoursesMap,
  destination: DraggableLocation,
  source: DraggableLocation,
  schedule: DNDSchedule,
  setDNDSchedule: (schedule: DNDSchedule) => void,
  setCompletedCourses: (courses: ICompletedCoursesMap) => void
) {
  const completedCoursesCopy = { ...completedCourses };

  const sourceIdx = getIndexFromCompletedCoursesDNDID(source.droppableId);

  const startClasses = Array.from(completedCourses[sourceIdx]);
  const movedClass = startClasses[source.index];
  startClasses.splice(source.index, 1);
  completedCoursesCopy[sourceIdx] = startClasses;

  const destSemesterSeason = convertTermIdToSeason(
    Number(destination.droppableId)
  );
  const destSemesterYear = convertTermIdToYear(Number(destination.droppableId));
  const finishYear: DNDScheduleYear = schedule.yearMap[destSemesterYear];
  const finishSemester: DNDScheduleTerm = (finishYear as any)[
    destSemesterSeason
  ];

  const finishClasses = Array.from(finishSemester.classes);
  finishClasses.splice(destination.index, 0, movedClass);
  const newFinishSemester: DNDScheduleTerm = {
    ...finishSemester,
    classes: finishClasses,
  };

  const newFinishSemesterYear = convertTermIdToYear(newFinishSemester.termId);
  const newFinishSemesterSeason = convertTermIdToSeason(
    newFinishSemester.termId
  );

  setCompletedCourses(completedCoursesCopy);

  setDNDSchedule({
    ...schedule,
    yearMap: {
      ...schedule.yearMap,
      [newFinishSemesterYear]: {
        ...schedule.yearMap[newFinishSemesterYear],
        [newFinishSemesterSeason]: newFinishSemester,
      },
    },
  });
}
