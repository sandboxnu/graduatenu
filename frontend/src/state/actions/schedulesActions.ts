import { createAction } from "typesafe-actions";

export const setActiveScheduleAction = createAction(
  "schedules/SET_ACTIVE_SCHEDULE",
  (activeSchedule: number) => ({ activeSchedule })
)();
