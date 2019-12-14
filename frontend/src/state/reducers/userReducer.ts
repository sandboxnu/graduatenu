import { Major } from "../../models/types";
import produce from "immer";
import { StateType, getType } from "typesafe-actions";
import { UserAction } from "../actions";
import {
  setMajorAction,
  setPlanStrAction,
  setFullNameAction,
  setAcademicYearAction,
  setGraduationYearAction,
} from "../actions/userActions";

export interface UserState {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  major?: Major;
  planStr?: string;
}

const initialState: UserState = {
  fullName: "",
  academicYear: 0,
  graduationYear: 0,
  major: undefined,
  planStr: "",
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setPlanStrAction): {
        draft.planStr = action.payload.planStr;
        return draft;
      }
      case getType(setMajorAction): {
        draft.major = action.payload.major;
        draft.planStr = undefined;
        return draft;
      }
      case getType(setFullNameAction): {
        draft.fullName = action.payload.fullName;
        return draft;
      }
      case getType(setAcademicYearAction): {
        draft.academicYear = action.payload.academicYear;
        return draft;
      }
      case getType(setGraduationYearAction): {
        draft.graduationYear = action.payload.graduationYear;
        return draft;
      }
    }
  });
};
