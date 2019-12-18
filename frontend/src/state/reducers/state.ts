import { ScheduleState, scheduleReducer } from "./scheduleReducer";
import { combineReducers } from "redux";
import { userReducer, UserState } from "./userReducer";
import { MajorApiState, majorsReducer } from "./apiReducer";

export interface AppState {
  schedule: ScheduleState;
  user: UserState;
  majors: MajorApiState;
}

export const rootReducer = combineReducers({
  schedule: scheduleReducer,
  user: userReducer,
  majors: majorsReducer,
});
