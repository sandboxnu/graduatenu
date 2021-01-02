import { IRequiredCourse } from "../../../../common/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { StudentAction, UserPlansAction } from "../actions";
import {
  setAcademicYearAction,
  setGraduationYearAction,
  setUserCoopCycleAction,
  setExamCreditsAction,
  resetUserAction,
  setUserMajorAction,
  setStudentAction,
  addTransferClassAction,
  removeTransferClassAction,
  setCompletedCoursesAction,
  setCompletedRequirementsAction,
  setTransferCoursesAction,
  setUserCatalogYearAction,
} from "../actions/studentActions";
import { IUserData } from "../../models/types";
import { ScheduleCourse } from "../../../../common/types";

export interface StudentState {
  student?: IUserData;
  completedRequirements: IRequiredCourse[]; // only used in onboarding flow
}

const initialState: StudentState = {
  student: undefined,
  completedRequirements: [],
};

export const studentReducer = (
  state: StudentState = initialState,
  action: StudentAction | UserPlansAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setStudentAction): {
        draft.student = action.payload.student;
        // TODO: remove these once backend is hooked up for completed/transfer courses
        if (draft.student.completedCourses === undefined) {
          draft.student.completedCourses = [];
        }
        if (draft.student.transferCourses === undefined) {
          draft.student.transferCourses = [];
        }
        return draft;
      }
      case getType(setUserMajorAction): {
        draft.student!.major = action.payload.major;
        draft.student!.coopCycle = null;
        return draft;
      }
      case getType(setAcademicYearAction): {
        draft.student!.academicYear = action.payload.academicYear;
        return draft;
      }
      case getType(setGraduationYearAction): {
        draft.student!.graduationYear = action.payload.graduationYear;
        return draft;
      }
      case getType(setUserCoopCycleAction): {
        draft.student!.coopCycle = action.payload.coopCycle;
        return draft;
      }
      case getType(setUserCatalogYearAction): {
        draft.student!.catalogYear = action.payload.catalogYear;
        draft.student!.major = null;
        draft.student!.coopCycle = null;
        return draft;
      }
      case getType(setExamCreditsAction): {
        draft.student!.examCredits = action.payload.examCredits;
        return draft;
      }
      case getType(resetUserAction): {
        return initialState;
      }
      case getType(addTransferClassAction): {
        const { courses } = action.payload;
        draft.student!.transferCourses.push(...courses);

        return draft;
      }
      case getType(removeTransferClassAction): {
        const { course } = action.payload;

        draft.student!.transferCourses = draft.student!.transferCourses.filter(
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
        draft.student!.completedCourses = completedCourses;
        return draft;
      }
      case getType(setTransferCoursesAction): {
        draft.student!.transferCourses = action.payload.transferCourses;
        return draft;
      }
    }
  });
};
