import { AppState } from "./reducers/state";
import {
  DNDSchedule,
  CourseWarning,
  IWarning,
  DNDScheduleTerm,
} from "../models/types";
import { Major, Schedule } from "graduate-common";

/**
 * Utility functions to help extract data from the AppState
 */

/**
 * Get a users fullname from the AppState
 * @param state the AppState
 */
export const getFullNameFromState = (state: AppState): string =>
  state.user.fullName;

/**
 * Get the schedule object from the AppState
 * @param state the AppState
 */
export const getScheduleFromState = (state: AppState): DNDSchedule =>
  state.schedule.present.schedule;

/**
 * Get the selected planName from the AppState
 * @param state the AppState
 */
export const getPlanStrFromState = (state: AppState): string | undefined =>
  state.user.planStr;

/**
 * Get the selected major object from the AppState
 * @param state the AppState
 */
export const getMajorFromState = (state: AppState): Major | undefined =>
  state.user.major;

export const getToken = (state: AppState): string =>
  state.user.token;

export const getId = (state: AppState): number =>
  state.user.id;

export const getEmail = (state: AppState): string =>
  state.user.email;

/**
 * Get the warnings generated from the AppState
 * @param state the AppState
 */
export const getWarningsFromState = (state: AppState): IWarning[] =>
  state.schedule.present.warnings;

/**
 * Get the list of majors from the AppState
 * @param state the AppState
 */
export const getMajors = (state: AppState): Major[] => state.majorState.majors;

/**
 * Get the majors loading flag from the AppState
 * @param state the AppState
 */
export const getMajorsLoadingFlag = (state: AppState): boolean =>
  state.majorState.isFetchingMajors;

/**
 * Get the majors loading error message from the AppState
 * @param state the AppState
 */
export const getMajorsError = (state: AppState): string =>
  state.majorState.majorsError;

/**
 * Get the list of plans from the AppState
 * @param state the AppState
 */
export const getPlans = (state: AppState): Record<string, Schedule[]> =>
  state.plansState.plans;

/**
 * Get the plans loading flag from the AppState
 * @param state the AppState
 */
export const getPlansLoadingFlag = (state: AppState): boolean =>
  state.plansState.isFetchingPlans;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getPlansError = (state: AppState): string =>
  state.plansState.plansError;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getTakenCredits = (state: AppState): number =>
  state.schedule.present.creditsTaken;
 
/**
 * Get the course specific warnings from the AppState
 * @param state the AppState
 */
export const getCourseWarningsFromState = (
  state: AppState,
  semester: DNDScheduleTerm
): CourseWarning[] =>
  state.schedule.present.courseWarnings.filter(
    w => w.termId === semester.termId
  );
