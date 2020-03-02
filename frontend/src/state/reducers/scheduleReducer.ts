import {
  DNDSchedule,
  IWarning,
  CourseWarning,
  DNDScheduleCourse,
} from "../../models/types";
import { mockData } from "../../data/mockData";
import produce from "immer";
import { getType } from "typesafe-actions";
import { ScheduleAction } from "../actions";
import {
  addClassesAction,
  removeClassAction,
  changeSemesterStatusAction,
  updateSemesterAction,
  setScheduleAction,
  setDNDScheduleAction,
  addCompletedCourses,
  removeCompletedCoursesAction,
  setCompletedCourses,
  setCompletedCoursesFromMap,
  undoRemoveClassAction,
  setCoopCycle,
} from "../actions/scheduleActions";
import {
  convertTermIdToSeason,
  convertToDNDSchedule,
  convertToDNDCourses,
  produceWarnings,
} from "../../utils";
import { getNumberOfCompletedCourses } from "../../utils/completed-courses-helpers";

export interface ScheduleState {
  past?: ScheduleStateSlice;
  present: ScheduleStateSlice;
}

export interface ScheduleStateSlice {
  currentClassCounter: number;
  isScheduleLoading: boolean; // not used right now
  scheduleError: string; // not used right now
  schedule: DNDSchedule;
  warnings: IWarning[];
  courseWarnings: CourseWarning[];
  completedCourses: ICompletedCoursesMap;
}

export interface ICompletedCoursesMap {
  [idx: number]: DNDScheduleCourse[]; // 0 1 2 3
}

const initialState: ScheduleState = {
  present: {
    currentClassCounter: 0,
    isScheduleLoading: false,
    scheduleError: "",
    schedule: mockData,
    warnings: [],
    courseWarnings: [],
    completedCourses: { 0: [], 1: [], 2: [], 3: [] },
  },
};

export const scheduleReducer = (
  state: ScheduleState = initialState,
  action: ScheduleAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(addClassesAction): {
        const { courses, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        const [dndCourses, newCounter] = convertToDNDCourses(
          courses,
          draft.present.currentClassCounter
        );

        draft.present.currentClassCounter = newCounter;

        draft.present.schedule.yearMap[semester.year][season].classes.push(
          ...dndCourses
        );

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(removeClassAction): {
        const { course, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        // save prev state with a deep copy
        draft.past = JSON.parse(JSON.stringify(draft.present));

        draft.present.schedule.yearMap[semester.year][
          season
        ].classes = draft.present.schedule.yearMap[semester.year][
          season
        ].classes.filter(c => c.dndId !== course.dndId);

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(undoRemoveClassAction): {
        draft.present = JSON.parse(JSON.stringify(draft.past));
        return draft;
      }
      case getType(changeSemesterStatusAction): {
        const { newStatus, year, season } = action.payload;
        draft.present.schedule.yearMap[year][season].status = newStatus;
        return draft;
      }
      case getType(updateSemesterAction): {
        const { year, season, newSemester } = action.payload;
        draft.present.schedule.yearMap[year][season] = newSemester;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setScheduleAction): {
        const schedule = JSON.parse(JSON.stringify(action.payload.schedule)); /// deep copy of schedule, because schedule is modified
        const [newSchedule, newCounter] = convertToDNDSchedule(
          JSON.parse(JSON.stringify(schedule)),
          draft.present.currentClassCounter
        );
        draft.present.schedule = newSchedule;
        draft.present.currentClassCounter = newCounter;

        const container = produceWarnings(schedule);

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setCoopCycle): {
        const { schedule } = action.payload;
        if (!schedule) {
          return draft;
        }
        const [newSchedule, newCounter] = convertToDNDSchedule(
          schedule,
          draft.present.currentClassCounter
        );
        draft.present.schedule = newSchedule;
        draft.present.currentClassCounter = newCounter;

        // remove all classes
        const yearMapCopy = JSON.parse(
          JSON.stringify(draft.present.schedule.yearMap)
        );
        for (const y of draft.present.schedule.years) {
          const year = JSON.parse(
            JSON.stringify(draft.present.schedule.yearMap[y])
          );
          year.fall.classes = [];
          year.spring.classes = [];
          year.summer1.classes = [];
          year.summer2.classes = [];
          yearMapCopy[y] = year;
        }
        draft.present.schedule.yearMap = yearMapCopy;

        // clear all warnings
        draft.present.warnings = [];
        draft.present.courseWarnings = [];

        return draft;
      }
      case getType(setDNDScheduleAction): {
        draft.present.schedule = action.payload.schedule;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(action.payload.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(addCompletedCourses): {
        const [dndCourses, newCounter] = convertToDNDCourses(
          action.payload.completedCourses,
          draft.present.currentClassCounter
        );

        draft.present.currentClassCounter = newCounter;

        const totalClasses =
          getNumberOfCompletedCourses(draft.present.completedCourses) +
          action.payload.completedCourses.length;
        const maxCoursesPerColumn =
          totalClasses < 20 ? 5 : totalClasses / 4 + 1;

        for (let i = 0; i < 4; i++) {
          while (
            draft.present.completedCourses[i].length < maxCoursesPerColumn
          ) {
            if (dndCourses.length === 0) {
              return draft;
            }
            draft.present.completedCourses[i].push(dndCourses.shift()!);
          }
        }

        return draft;
      }
      case getType(setCompletedCourses): {
        const [dndCourses, newCounter] = convertToDNDCourses(
          action.payload.completedCourses,
          draft.present.currentClassCounter
        );
        draft.present.currentClassCounter = newCounter;

        const totalClasses = action.payload.completedCourses.length;
        const maxCoursesPerColumn =
          totalClasses < 20 ? 5 : totalClasses / 4 + 1;

        for (let i = 0; i < 4; i++) {
          // clear array
          draft.present.completedCourses[i] = [];
        }

        for (let i = 0; i < 4; i++) {
          while (
            draft.present.completedCourses[i].length < maxCoursesPerColumn
          ) {
            if (dndCourses.length === 0) {
              return draft;
            }
            draft.present.completedCourses[i].push(dndCourses.shift()!);
          }
        }
        return draft;
      }
      case getType(setCompletedCoursesFromMap): {
        draft.present.completedCourses = action.payload.completedCourses;
        return draft;
      }
      case getType(removeCompletedCoursesAction): {
        for (let i = 0; i < 4; i++) {
          draft.present.completedCourses[i] = draft.present.completedCourses[
            i
          ].filter(c => c.dndId !== action.payload.completedCourse.dndId);
        }
        return draft;
      }
    }
  });
};
