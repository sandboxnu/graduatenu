import { NamedSchedule } from "../../models/types";
import { mockData } from "../../data/mockData";
import produce from "immer";
import { getType } from "typesafe-actions";
import { SchedulesAction } from "../actions";
import {
  setActiveScheduleAction,
  updateActiveSchedule,
  addNewSchedule,
} from "../actions/schedulesActions";

export interface SchedulesState {
  activeSchedule: number;
  schedules: NamedSchedule[];
}

const initialState: SchedulesState = {
  activeSchedule: 0,
  schedules: [
    {
      name: "Schedule 1",
      schedule: {
        present: {
          currentClassCounter: 100,
          isScheduleLoading: false,
          scheduleError: "",
          schedule: mockData,
          warnings: [],
          courseWarnings: [],
        },
      },
    },
  ],
};

export const schedulesReducer = (
  state: SchedulesState = initialState,
  action: SchedulesAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setActiveScheduleAction): {
        const { activeSchedule } = action.payload;

        draft.activeSchedule = activeSchedule;

        return draft;
      }
      case getType(updateActiveSchedule): {
        const { updatedActiveSchedule } = action.payload;

        draft.schedules[draft.activeSchedule] = updatedActiveSchedule;

        return draft;
      }
      case getType(addNewSchedule): {
        const { newSchedule } = action.payload;

        draft.schedules.push(newSchedule);
        draft.activeSchedule = draft.schedules.length - 1;

        return draft;
      }
    }
  });
};
