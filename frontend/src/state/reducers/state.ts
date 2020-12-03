import { ScheduleState, scheduleReducer } from "./scheduleReducer";
import { combineReducers } from "redux";
import { userReducer, UserState } from "./userReducer";
import { SchedulesState, schedulesReducer } from "./schedulesReducer";
import {
  MajorApiState,
  PlansApiState,
  majorsReducer,
  plansReducer,
} from "./apiReducer";
import { advisorReducer, AdvisorState } from "./advisorReducer";

export interface AppState {
  schedule: ScheduleState;
  user: UserState;
  majorState: MajorApiState;
  plansState: PlansApiState;
  schedules: SchedulesState;
  advisorState: AdvisorState;
}

export const rootReducer = combineReducers({
  schedule: scheduleReducer,
  user: userReducer,
  majorState: majorsReducer,
  plansState: plansReducer,
  schedules: schedulesReducer,
  advisorState: advisorReducer,
});
