import { createAction } from "typesafe-actions";
import { NamedSchedule } from "../../models/types";

export const setActiveScheduleAction = createAction(
  "schedules/SET_ACTIVE_SCHEDULE",
  (activeSchedule: number) => ({ activeSchedule })
)();

export const addNewSchedule = createAction(
  "schedules/ADD_NEW_SCHEDULE",
  (newSchedule: NamedSchedule) => ({ newSchedule })
)();

export const updateActiveSchedule = createAction(
  "schedules/UPDATE_ACTIVE_SCHEDULE",
  (updatedActiveSchedule: NamedSchedule) => ({ updatedActiveSchedule })
)();
