import { ScheduleState, scheduleReducer } from "./scheduleReducer";
import { combineReducers } from "redux";
import { userReducer, UserState } from "./userReducer";

export interface AppState {
  schedule: ScheduleState;
  user: UserState;
}

export const rootReducer = combineReducers({
  schedule: scheduleReducer,
  user: userReducer,
});
