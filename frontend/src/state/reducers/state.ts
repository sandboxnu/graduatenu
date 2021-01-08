import { combineReducers } from "redux";
import { studentReducer, StudentState } from "./studentReducer";
import { UserPlansState, userPlansReducer } from "./userPlansReducer";
import {
  MajorApiState,
  PlansApiState,
  majorsReducer,
  plansReducer,
} from "./apiReducer";
import { advisorReducer, AdvisorState } from "./advisorReducer";

export interface AppState {
  studentState: StudentState;
  majorState: MajorApiState;
  plansState: PlansApiState;
  userPlansState: UserPlansState;
  advisorState: AdvisorState;
}

export const rootReducer = combineReducers({
  studentState: studentReducer,
  majorState: majorsReducer,
  plansState: plansReducer,
  userPlansState: userPlansReducer,
  advisorState: advisorReducer,
});
