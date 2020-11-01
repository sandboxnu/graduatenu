import { NamedSchedule } from "../../models/types";
import { mockData } from "../../data/mockData";
import produce from "immer";
import { getType } from "typesafe-actions";
import { SchedulesAction, UserAction } from "../actions";
import {
  setActiveScheduleAction,
  updateActiveSchedule,
  addNewSchedule,
  setSchedules,
  deletePlan,
} from "../actions/schedulesActions";
import { resetUserAction } from "../actions/userActions";

export interface SchedulesState {
  activeSchedule?: string;
  schedules: { [key: string]: NamedSchedule };
}

const initialState: SchedulesState = {
  activeSchedule: undefined,
  schedules: {},
};

export const schedulesReducer = (
  state: SchedulesState = initialState,
  action: SchedulesAction | UserAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setActiveScheduleAction): {
        const { activeSchedule } = action.payload;

        draft.activeSchedule = activeSchedule;

        return draft;
      }
      case getType(updateActiveSchedule): {
        const { updatedSchedule } = action.payload;

        if (draft.activeSchedule && draft.schedules[draft.activeSchedule]) {
          draft.schedules[
            draft.activeSchedule
          ].schedule.present = updatedSchedule;
        }

        return draft;
      }
      case getType(addNewSchedule): {
        const { name, newSchedule } = action.payload;

        const namedSchedule = {
          name: name,
          schedule: { present: newSchedule },
        };

        draft.schedules[name] = namedSchedule;
        draft.activeSchedule = name;

        return draft;
      }
      case getType(setSchedules): {
        const { schedules } = action.payload;

        const scheduleMap: { [key: string]: NamedSchedule } = {};
        schedules.forEach((namedSchedule: NamedSchedule) => {
          scheduleMap[namedSchedule.name] = namedSchedule;
        });

        draft.schedules = scheduleMap;
        draft.activeSchedule = schedules[0].name;

        return draft;
      }
      case getType(resetUserAction): {
        draft = initialState;
        return draft;
      }
      case getType(deletePlan): {
        const name = action.payload.name;
        if (Object.values(draft.schedules)) delete draft.schedules[name];
        if (draft.activeSchedule === name)
          draft.activeSchedule = draft.schedules[0].name;
        return draft;
      }
    }
  });
};
