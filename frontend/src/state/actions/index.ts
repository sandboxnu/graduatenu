import * as scheduleActions from "./scheduleActions";
import * as userActions from "./userActions";
import { ActionType } from "typesafe-actions";

export type ScheduleAction = ActionType<typeof scheduleActions>;
export type UserAction = ActionType<typeof userActions>;
