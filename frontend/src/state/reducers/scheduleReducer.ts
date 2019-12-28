import { DNDSchedule, IWarning, CourseWarning } from "../../models/types";
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
  undoRemoveClassAction,
} from "../actions/scheduleActions";
import {
  convertTermIdToSeason,
  convertToDNDSchedule,
  convertToDNDCourses,
  produceWarnings,
} from "../../utils";

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
}

const initialState: ScheduleState = {
  present: {
    currentClassCounter: 0,
    isScheduleLoading: false,
    scheduleError: "",
    schedule: mockData,
    warnings: [],
    courseWarnings: [],
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
        const { schedule } = action.payload;
        const [newSchedule, newCounter] = convertToDNDSchedule(
          schedule,
          draft.present.currentClassCounter
        );
        draft.present.schedule = newSchedule;
        draft.present.currentClassCounter = newCounter;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(action.payload.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

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
    }
  });
};
