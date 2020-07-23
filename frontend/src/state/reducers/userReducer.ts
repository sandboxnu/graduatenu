import { Major } from "../../../../common/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { UserAction, ScheduleAction } from "../actions";
import {
  setMajorAction,
  setFullNameAction,
  setAcademicYearAction,
  setGraduationYearAction,
  setTokenAction,
} from "../actions/userActions";
import { setCoopCycle } from "../actions/scheduleActions";
import { planToString } from "../../utils";

export interface UserState {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  major?: Major;
  planStr?: string;
  token: string;
}

const initialState: UserState = {
  fullName: "",
  academicYear: 0,
  graduationYear: 0,
  major: undefined,
  planStr: "",
  token: "",
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction | ScheduleAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setCoopCycle): {
        if (action.payload.schedule) {
          draft.planStr = planToString(action.payload.schedule);
        } else {
          draft.planStr = undefined;
        }
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
      case getType(setTokenAction): {
        draft.token = action.payload.token;
        return draft;
      }
    }
  });
};
