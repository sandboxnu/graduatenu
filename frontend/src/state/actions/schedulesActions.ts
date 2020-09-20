import { createAction } from "typesafe-actions";
import { ScheduleSlice, NamedSchedule } from "../../models/types";

export const setActiveScheduleAction = createAction(
  "schedules/SET_ACTIVE_SCHEDULE",
  (activeSchedule: number) => ({ activeSchedule })
)();

export const addNewSchedule = createAction(
  "schedules/ADD_NEW_SCHEDULE",
  (name: string, newSchedule: ScheduleSlice) => ({ name, newSchedule })
)();

export const setSchedules = createAction(
  "schedules/SET_SCHEDULE",
  (schedules: NamedSchedule[]) => ({ schedules })
)();

export const updateActiveSchedule = createAction(
  "schedules/UPDATE_ACTIVE_SCHEDULE",
  (updatedSchedule: ScheduleSlice) => ({ updatedSchedule })
)();
