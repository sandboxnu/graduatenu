import { TransferableExam, Major } from "../../../../common/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { UserAction, ScheduleAction } from "../actions";
import {
  setDeclaredMajorAction,
  setFullNameAction,
  setAcademicYearAction,
  setGraduationYearAction,
  setUserIdAction,
  addPlanIdAction,
  setLinkSharingAction,
  setPlanNameAction,
  setMajorPlanAction,
  setPlanIdsAction,
  setUserCoopCycleAction,
  setEmailAction,
  setExamCredits,
  resetUserAction,
  deletePlanId,
  setIsAdvisorAction,
} from "../actions/userActions";
import { setCoopCycle, setNamedSchedule } from "../actions/scheduleActions";
import { planToString } from "../../utils";

export interface UserState {
  fullName: string;
  academicYear: number;
  graduationYear: number;
  planIds: number[];
  userId?: number;

  // TODO: after plan reducer is made, move these fields
  planName: string;
  planStr?: string;
  linkSharing: boolean;
  declaredMajor?: Major;
  email: string;
  coopCycle: string;
  examCredits: TransferableExam[];
  isAdvisor?: boolean;
}

const initialState: UserState = {
  fullName: "",
  academicYear: 0,
  graduationYear: 0,
  planIds: [],
  userId: undefined,
  planStr: "",
  planName: "",
  linkSharing: false,
  declaredMajor: undefined,
  email: "",
  coopCycle: "",
  examCredits: [],
  isAdvisor: undefined,
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
      case getType(setEmailAction): {
        draft.email = action.payload.email;
        return draft;
      }
      case getType(setUserCoopCycleAction): {
        draft.coopCycle = action.payload.coopCycle;
        return draft;
      }
      case getType(setExamCredits): {
        draft.examCredits = action.payload.examCredits;
        return draft;
      }
      case getType(resetUserAction): {
        draft = initialState;
        return draft;
      }
      case getType(setMajorPlanAction): {
        draft.declaredMajor = action.payload.major;
        draft.planStr = action.payload.planStr;
        return draft;
      }
      case getType(deletePlanId): {
        draft.planIds = draft.planIds.filter(
          (id: number) => id !== action.payload.planId
        );
        return draft;
      }
      case getType(setNamedSchedule): {
        draft.planName = action.payload.namedSchedule.name;
        return draft;
      }
      case getType(setIsAdvisorAction): {
        draft.isAdvisor = action.payload.isAdvisor;
        return draft;
      }
    }
  });
};
