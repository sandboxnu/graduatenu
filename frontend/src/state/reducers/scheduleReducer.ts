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
} from "../actions/scheduleActions";
import {
  convertTermIdToSeason,
  convertToDNDSchedule,
  convertToDNDCourses,
  produceWarnings,
} from "../../utils";

export interface ScheduleState {
  currentClassCounter: number;
  isScheduleLoading: boolean; // not used right now
  scheduleError: string; // not used right now
  schedule: DNDSchedule;
  warnings: IWarning[];
  courseWarnings: CourseWarning[];
  completedCourses: DNDScheduleCourse[];
}

const initialState: ScheduleState = {
  currentClassCounter: 0,
  isScheduleLoading: false,
  scheduleError: "",
  schedule: mockData,
  warnings: [],
  courseWarnings: [],
  completedCourses: [],
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
          draft.currentClassCounter
        );

        draft.currentClassCounter = newCounter;

        draft.schedule.yearMap[semester.year][season].classes.push(
          ...dndCourses
        );

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.warnings = container.normalWarnings;
        draft.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(removeClassAction): {
        const { course, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);
        draft.schedule.yearMap[semester.year][
          season
        ].classes = draft.schedule.yearMap[semester.year][
          season
        ].classes.filter(c => c.dndId !== course.dndId);

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.warnings = container.normalWarnings;
        draft.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(changeSemesterStatusAction): {
        const { newStatus, year, season } = action.payload;
        draft.schedule.yearMap[year][season].status = newStatus;
        return draft;
      }
      case getType(updateSemesterAction): {
        const { year, season, newSemester } = action.payload;
        draft.schedule.yearMap[year][season] = newSemester;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.warnings = container.normalWarnings;
        draft.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setScheduleAction): {
        const { schedule } = action.payload;
        const [newSchedule, newCounter] = convertToDNDSchedule(
          schedule,
          draft.currentClassCounter
        );
        draft.schedule = newSchedule;
        draft.currentClassCounter = newCounter;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(action.payload.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.warnings = container.normalWarnings;
        draft.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setDNDScheduleAction): {
        draft.schedule = action.payload.schedule;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(action.payload.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.warnings = container.normalWarnings;
        draft.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(addCompletedCourses): {
        const [dndCourses, newCounter] = convertToDNDCourses(
          action.payload.completedCourses,
          draft.currentClassCounter
        );

        draft.currentClassCounter = newCounter;
        draft.completedCourses.push(...dndCourses);

        return draft;
      }
    }
  });
};
