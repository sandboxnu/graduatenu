import { Major } from "../../models/types";
import { MajorsApiAction } from "../actions";
import { getType } from "typesafe-actions";
import {
  fetchMajorsPendingAction,
  fetchMajorsSuccessAction,
  fetchMajorsErrorAction,
} from "../actions/majorsActions";
import produce from "immer";

export interface MajorApiState {
  isFetchingMajors: boolean;
  majors: Major[];
  majorsError: string;
}

const initialState: MajorApiState = {
  isFetchingMajors: false,
  majors: [],
  majorsError: "",
};

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

export const getMajors = (state: MajorApiState) => state.majors;
export const getMajorsLoadingFlag = (state: MajorApiState) =>
  state.isFetchingMajors;
export const getMajorsError = (state: MajorApiState) => state.majorsError;
