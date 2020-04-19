import { createAction } from "typesafe-actions";
import { PastPresentSchedule } from "../../models/types";

export const addScheduleAction = createAction(
  "schedules/ADD_SCHEDULE",
  (schedule: PastPresentSchedule, name: string) => ({
    schedule,
    name,
  })
)();

export const removeScheduleAction = createAction(
  "schedules/REMOVE_SCHEDULE",
  (schedule: PastPresentSchedule, name: string) => ({
    schedule,
    name,
  })
)();

export const setActiveScheduleAction = createAction(
  "schedules/SET_ACTIVE_SCHEDULE",
  (activeSchedule: number) => ({ activeSchedule })
)();
