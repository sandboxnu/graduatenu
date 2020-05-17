import { NamedSchedule } from "../../models/types";
import { mockData } from "../../data/mockData";
import produce from "immer";
import { getType } from "typesafe-actions";
import { SchedulesAction } from "../actions";
import {
  addScheduleAction,
  removeScheduleAction,
  setActiveScheduleAction,
} from "../actions/schedulesActions";

export interface SchedulesState {
  activeSchedule: number;
  schedules: NamedSchedule[];
}

const initialState: SchedulesState = {
  activeSchedule: 0,
  schedules: [
    {
      name: "sample-schedule",
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
      case getType(addScheduleAction): {
        const { schedule, name } = action.payload;

        draft.schedules.push({ name: name, schedule: schedule });

        return draft;
      }
      case getType(removeScheduleAction): {
        const { schedule, name } = action.payload;

        draft.schedules.filter(
          (s: NamedSchedule) => name !== s.name && schedule !== s.schedule
        );

        return draft;
      }
      case getType(setActiveScheduleAction): {
        const { activeSchedule } = action.payload;

        draft.activeSchedule = activeSchedule;

        return draft;
      }
    }
  });
};
