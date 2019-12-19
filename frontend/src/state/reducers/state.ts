import { ScheduleState, scheduleReducer } from "./scheduleReducer";
import { combineReducers } from "redux";
import { userReducer, UserState } from "./userReducer";
import { MajorApiState, majorsReducer } from "./apiReducer";

export interface AppState {
  schedule: ScheduleState;
  user: UserState;
  majorState: MajorApiState;
}

export const rootReducer = combineReducers({
  schedule: scheduleReducer,
  user: userReducer,
  majorState: majorsReducer,
});
