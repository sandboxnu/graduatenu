import { IRequiredCourse } from "./../../../../common/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { UserAction, UserPlansAction } from "../actions";
import {
  setAcademicYearAction,
  setGraduationYearAction,
  setUserCoopCycleAction,
  setExamCreditsAction,
  resetUserAction,
  setUserMajorAction,
  setUserAction,
  addTransferClassAction,
  removeTransferClassAction,
  setCompletedCoursesAction,
  setCompletedRequirementsAction,
  setTransferCoursesAction,
  setUserCatalogYearAction,
} from "../actions/userActions";
import { IUserData } from "../../models/types";
import { ScheduleCourse } from "../../../../common/types";

export interface UserState {
  user?: IUserData;
  completedRequirements: IRequiredCourse[]; // only used in onboarding flow
}

const initialState: UserState = {
  user: undefined,
  completedRequirements: [],
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction | UserPlansAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setUserAction): {
        draft.user = action.payload.user;
        // TODO: remove these once backend is hooked up for completed/transfer courses
        if (draft.user.completedCourses === undefined) {
          draft.user.completedCourses = [];
        }
        if (draft.user.transferCourses === undefined) {
          draft.user.transferCourses = [];
        }
        return draft;
      }
      case getType(setUserMajorAction): {
        draft.user!.major = action.payload.major;
        draft.user!.coopCycle = null;
        return draft;
      }
      case getType(setAcademicYearAction): {
        draft.user!.academicYear = action.payload.academicYear;
        return draft;
      }
      case getType(setGraduationYearAction): {
        draft.user!.graduationYear = action.payload.graduationYear;
        return draft;
      }
      case getType(setUserCoopCycleAction): {
        draft.user!.coopCycle = action.payload.coopCycle;
        return draft;
      }
      case getType(setUserCatalogYearAction): {
        draft.user!.catalogYear = action.payload.catalogYear;
        draft.user!.major = null;
        draft.user!.coopCycle = null;
        return draft;
      }
      case getType(setExamCreditsAction): {
        draft.user!.examCredits = action.payload.examCredits;
        return draft;
      }
      case getType(resetUserAction): {
        return initialState;
      }
      case getType(addTransferClassAction): {
        const { courses } = action.payload;
        draft.user!.transferCourses.push(...courses);

        return draft;
      }
      case getType(removeTransferClassAction): {
        const { course } = action.payload;

        draft.user!.transferCourses = draft.user!.transferCourses.filter(
          c => c.classId !== course.classId
        );

        return draft;
      }
      case getType(setCompletedRequirementsAction): {
        draft.completedRequirements = action.payload.completedRequirements;
        return draft;
      }
      case getType(setCompletedCoursesAction): {
        // sort the completed courses so that when we add it to the schedule, it'll be more or less in order
        // for some reason it doesn't register classID as a string so I use toString
        const completedCourses = action.payload.completedCourses.sort(
          (course1: ScheduleCourse, course2: ScheduleCourse) =>
            course1.classId.toString().localeCompare(course2.classId.toString())
        );
        draft.user!.completedCourses = completedCourses;
        return draft;
      }
      case getType(setTransferCoursesAction): {
        draft.user!.transferCourses = action.payload.transferCourses;
        return draft;
      }
    }
  });
};
