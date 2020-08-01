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
  setUserIdAction,
  addPlanIdAction,
  setLinkSharingAction,
  setPlanNameAction,
  setMajorPlanAction,
  setPlanIdsAction,
} from "../actions/userActions";
import { setCoopCycle } from "../actions/scheduleActions";
import { planToString } from "../../utils";

export interface UserState {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  planIds: number[];
  token?: string; // if a token and userId are undefined, then no user is logged in
  userId?: number;

  // TODO: after plan reducer is made, move these fields
  planName: string;
  major?: Major;
  planStr?: string;
  linkSharing: boolean;
}

const initialState: UserState = {
  fullName: "",
  academicYear: 0,
  graduationYear: 0,
  planIds: [],
  token: undefined,
  userId: undefined,

  major: undefined,
  planStr: "",
  planName: "",
  linkSharing: false,
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
      case getType(setUserIdAction): {
        draft.userId = action.payload.id;
        return draft;
      }
      case getType(addPlanIdAction): {
        draft.planIds.push(action.payload.planId);
        return draft;
      }
      case getType(setPlanIdsAction): {
        draft.planIds = action.payload.planIds;
        return draft;
      }
      case getType(setLinkSharingAction): {
        draft.linkSharing = action.payload.linkSharing;
        return draft;
      }
      case getType(setPlanNameAction): {
        draft.planName = action.payload.name;
        return draft;
      }
      case getType(setMajorPlanAction): {
        draft.major = action.payload.major;
        draft.planStr = action.payload.planStr;
        return draft;
      }
    }
  });
};
