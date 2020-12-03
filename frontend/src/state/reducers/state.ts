import { combineReducers } from "redux";
import { userReducer, UserState } from "./userReducer";
import { UserPlansState, userPlansReducer } from "./userPlansReducer";
import {
  MajorApiState,
  PlansApiState,
  majorsReducer,
  plansReducer,
} from "./apiReducer";
import { advisorReducer, AdvisorState } from "./advisorReducer";

export interface AppState {
  userState: UserState;
  majorState: MajorApiState;
  plansState: PlansApiState;
  userPlansState: UserPlansState;
  advisorState: AdvisorState;
}

export const rootReducer = combineReducers({
  userState: userReducer,
  majorState: majorsReducer,
  plansState: plansReducer,
  userPlansState: userPlansReducer,
  advisorState: advisorReducer,
});
