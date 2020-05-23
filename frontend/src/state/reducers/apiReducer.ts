import { Major, Schedule } from "graduate-common";
import { MajorsApiAction } from "../actions";
import { PlansApiAction } from "../actions";
import { getType } from "typesafe-actions";
import {
  fetchMajorsPendingAction,
  fetchMajorsSuccessAction,
  fetchMajorsErrorAction,
} from "../actions/majorsActions";
import {
  fetchPlansPendingAction,
  fetchPlansSuccessAction,
  fetchPlansErrorAction,
} from "../actions/plansActions";
import produce from "immer";

/**
 * State to capture the major api fetch process.
 */
export interface MajorApiState {
  isFetchingMajors: boolean;
  majors: Major[];
  majorsError: string;
}

/**
 * State to capture the plan api fetch process.
 */
export interface PlansApiState {
  isFetchingPlans: boolean;
  plans: Record<string, Schedule[]>;
  plansError: string;
}

const initialState: MajorApiState = {
  isFetchingMajors: false,
  majors: [],
  majorsError: "",
};

const initialStatePlans: PlansApiState = {
  isFetchingPlans: false,
  plans: {},
  plansError: "",
};

/**
 * function object that handles how actions should update the MajorApiState portion of the AppState.
 * @param state the major api state.
 * @param action a union type of all major fetch related actions
 */
export const majorsReducer = (
  state: MajorApiState = initialState,
  action: MajorsApiAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(fetchMajorsPendingAction):
        draft.isFetchingMajors = true;
        return draft;
      case getType(fetchMajorsSuccessAction):
        const majors: Major[] = action.payload.majors;
        draft.isFetchingMajors = false;
        draft.majors = majors;
        return draft;
      case getType(fetchMajorsErrorAction):
        const errorMsg: string = action.payload.majorsError;
        draft.isFetchingMajors = false;
        draft.majorsError = errorMsg;
        return draft;
      default:
        return state;
    }
  });
};

/**
 * function object that handles how actions should update the PlanApiState portion of the AppState.
 * @param state the major api state.
 * @param action a union type of all plan fetch related actions
 */
export const plansReducer = (
  state: PlansApiState = initialStatePlans,
  action: PlansApiAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(fetchPlansPendingAction):
        draft.isFetchingPlans = true;
        return draft;
      case getType(fetchPlansSuccessAction):
        const plans: Record<string, Schedule[]> = action.payload.plans;
        draft.isFetchingPlans = false;
        draft.plans = plans;
        return draft;
      case getType(fetchPlansErrorAction):
        const errorMsg: string = action.payload.plansError;
        draft.isFetchingPlans = false;
        draft.plansError = errorMsg;
        return draft;
      default:
        return state;
    }
  });
};
