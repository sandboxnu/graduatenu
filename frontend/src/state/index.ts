import { AppState } from "./reducers/state";
import {
  DNDSchedule,
  Major,
  CourseWarning,
  IWarning,
  DNDScheduleTerm,
  Schedule,
} from "../models/types";

export const getFullNameFromState = (state: AppState): string =>
  state.user.fullName;

export const getScheduleFromState = (state: AppState): DNDSchedule =>
  state.schedule.present.schedule;

export const getPlanStrFromState = (state: AppState): string | undefined =>
  state.user.planStr;

export const getMajorFromState = (state: AppState): Major | undefined =>
  state.user.major;

export const getWarningsFromState = (state: AppState): IWarning[] =>
  state.schedule.present.warnings;

export const getMajors = (state: AppState): Major[] => state.majorState.majors;

export const getMajorsLoadingFlag = (state: AppState): boolean =>
  state.majorState.isFetchingMajors;

export const getMajorsError = (state: AppState): string =>
  state.majorState.majorsError;

export const getPlans = (state: AppState): Record<string, Schedule[]> =>
  state.plansState.plans;

export const getPlansLoadingFlag = (state: AppState): boolean =>
  state.plansState.isFetchingPlans;

export const getPlansError = (state: AppState): string =>
  state.plansState.plansError;

export const getCourseWarningsFromState = (
  state: AppState,
  semester: DNDScheduleTerm
): CourseWarning[] =>
  state.schedule.present.courseWarnings.filter(
    w => w.termId === semester.termId
  );
