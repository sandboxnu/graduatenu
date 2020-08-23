import { Major } from "../../../../common/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { UserAction, ScheduleAction } from "../actions";
import {
  setDeclaredMajorAction,
  setFullNameAction,
  setAcademicYearAction,
  setGraduationYearAction,
  setTokenAction,
  setIdAction,
  setUserCoopCycleAction,
  setEmailAction
} from "../actions/userActions";
import { setCoopCycle } from "../actions/scheduleActions";
import { planToString } from "../../utils";

export interface UserState {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  declaredMajor?: Major;
  planStr?: string;
  token: string;
  id: number;
  email: string;
  coopCycle: string;
}

const initialState: UserState = {
  fullName: "",
  academicYear: 0,
  graduationYear: 0,
  declaredMajor: undefined,
  planStr: "",
  token: "",
  id: 0,
  email: "",
  coopCycle: "",
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
      case getType(setDeclaredMajorAction): {
        draft.declaredMajor = action.payload.major;
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
      case getType(setIdAction): {
        draft.id = action.payload.id;
        return draft;
      }
      case getType(setEmailAction): {
        draft.email = action.payload.email;
        return draft;
      }
      case getType(setUserCoopCycleAction): {
        draft.coopCycle = action.payload.coopCycle;
        return draft;
      }
    }
  });
};
