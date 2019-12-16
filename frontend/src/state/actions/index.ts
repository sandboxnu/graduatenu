import * as scheduleActions from "./scheduleActions";
import * as majorsActions from "./majorsActions";
import * as userActions from "./userActions";
import { ActionType } from "typesafe-actions";

export type ScheduleAction = ActionType<typeof scheduleActions>;
export type UserAction = ActionType<typeof userActions>;
export type MajorsApiAction = ActionType<typeof majorsActions>;
