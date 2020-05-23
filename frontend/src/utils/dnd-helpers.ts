import { convertTermIdToSeason, convertTermIdToYear } from ".";
import {
  DNDScheduleYear,
  DNDScheduleTerm,
  DNDSchedule,
  DNDScheduleCourse,
} from "../models/types";
import { ScheduleCourse } from "graduate-common";
import { fetchCourse } from "../api";
import { convertToDNDCourses } from ".";

/**
 * Utility function to move a DNDCourse between semesters upon a drag movement.
 * @param schedule the schedule context of the moving course
 * @param destination the DND object referring to the target semester to be moved to
 * @param source the DND object referring to the semester the course is being moved from
 * @param setSchedule function to update the given schedule after operations are performed
 */
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

export async function addCourseFromSidebar(
  schedule: DNDSchedule,
  destination: any,
  source: any,
  setSchedule: (schedule: DNDSchedule) => void,
  draggableId: any
) {
  if (!destination) {
    return undefined;
  }

  const destSemesterSeason = convertTermIdToSeason(destination.droppableId);
  const destSemesterYear = convertTermIdToYear(destination.droppableId);
  const finishYear: DNDScheduleYear = schedule.yearMap[destSemesterYear];
  const finishSemester: DNDScheduleTerm = (finishYear as any)[
    destSemesterSeason
  ];

  let courseData: string[] = draggableId.split(" ");
  let scheduleCourse: ScheduleCourse | null = await fetchCourse(
    courseData[0],
    courseData[1]
  );

  if (scheduleCourse === null) {
    return;
  }

  let movedClass: DNDScheduleCourse = convertToDNDCourses(
    [scheduleCourse!],
    0
  )[0][0];

  const finishClasses = Array.from(finishSemester.classes);

  // account for CourseAndLab blocks
  let scheduleCourseLab: ScheduleCourse | null = null;
  let movedLab: DNDScheduleCourse;
  if (courseData.length === 4) {
    scheduleCourseLab = await fetchCourse(courseData[2], courseData[3]);
    movedLab = convertToDNDCourses([scheduleCourseLab!], 0)[0][0];
    finishClasses.splice(destination.index, 0, movedClass, movedLab);
  } else {
    finishClasses.splice(destination.index, 0, movedClass);
  }

  const newFinishSemester: DNDScheduleTerm = {
    ...finishSemester,
    classes: finishClasses,
  };

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

  setSchedule({
    ...schedule,
    yearMap: {
      ...schedule.yearMap,
      [newFinishSemesterYear]: {
        ...schedule.yearMap[newFinishSemesterYear],
        [newFinishSemesterSeason]: newFinishSemester,
      },
    },
  });
  return;
}
