import { IPlanData } from "./../models/types";
import { AppState } from "./reducers/state";
import { CourseWarning, IWarning, DNDScheduleTerm } from "../models/types";
import {
  Major,
  Schedule,
} from "../../../common/types";
import { findMajorFromName } from "../utils/plan-helpers";
import { getCreditsTakenInSchedule } from "../utils";

/**
 * Utility functions to help extract data from the AppState
 * All functions in this file should end with "FromState" for explicitness
 */

/**
 * Get the current user from state
 * @param state the AppState
 */
// Caution! Will error if there is not a user
export const getUserFromState = (state: AppState) => state.userState.user!;

export const getDoesUserExistInState = (state: AppState) => !!state.userState.user;

export const getUserIdFromState = (state: AppState) =>
  getUserFromState(state).id;

export const getUserFullNameFromState = (state: AppState) =>
  getUserFromState(state).fullName;

/**
 * Get the list of completed requirements from the AppState
 * @param state the AppState
 */
export const getCompletedRequirementsFromState = (
  state: AppState
) => state.userState.completedRequirements;

/**
 * Get the list of completed courses from the AppState
 * @param state the AppState
 */
export const getCompletedCoursesFromState = (
  state: AppState
) => getUserFromState(state).completedCourses;

/**
 * Get the list of transfer courses from the AppState
 * @param state the AppState
 */
export const getTransferCoursesFromState = (
  state: AppState
) => getUserFromState(state).transferCourses;

/**
 * Get the selected major object from the AppState
 * @param state the AppState
 */
export const getUserMajorFromState = (state: AppState): Major | undefined =>
  findMajorFromName(getUserFromState(state).major, getMajorsFromState(state));

/**
 * Get the selected major name from the AppState
 * @param state the AppState
 */
export const getUserMajorNameFromState = (state: AppState) =>
  getUserFromState(state).major;

export const getUserCoopCycleFromState = (state: AppState) =>
  getUserFromState(state).coopCycle;

export const getAcademicYearFromState = (state: AppState) =>
  getUserFromState(state).academicYear;

export const getGraduationYearFromState = (state: AppState) =>
  getUserFromState(state).graduationYear;

/**
 * Get the warnings generated from the AppState
 * @param state the AppState
 */
export const getWarningsFromState = (state: AppState): IWarning[] =>
  getActivePlanFromState(state).warnings;

/**
 * Get the list of majors from the AppState
 * @param state the AppState
 */
export const getMajorsFromState = (state: AppState): Major[] =>
  state.majorState.majors;

/**
 * Get the majors loading flag from the AppState
 * @param state the AppState
 */
export const getMajorsLoadingFlagFromState = (state: AppState): boolean =>
  state.majorState.isFetchingMajors;

/**
 * Get the majors loading error message from the AppState
 * @param state the AppState
 */
export const getMajorsErrorFromState = (state: AppState): string =>
  state.majorState.majorsError;

/**
 * Get the list of plans from the AppState
 * @param state the AppState
 */
export const getPlansFromState = (
  state: AppState
): Record<string, Schedule[]> => state.plansState.plans;

/**
 * Get the plans loading flag from the AppState
 * @param state the AppState
 */
export const getPlansLoadingFlagFromState = (state: AppState): boolean =>
  state.plansState.isFetchingPlans;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getPlansErrorFromState = (state: AppState): string =>
  state.plansState.plansError;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getTakenCreditsFromState = (state: AppState): number => getCreditsTakenInSchedule(getActivePlanScheduleFromState(state)!);

/**
 * Get the course specific warnings from the AppState
 * @param state the AppState
 */
export const getCourseWarningsFromState = (
  state: AppState,
  semester: DNDScheduleTerm
): CourseWarning[] => {
  if (!getActivePlanFromState(state)) {
    return [];
  }
  return getActivePlanFromState(state)!.courseWarnings.filter(
    w => w.termId === semester.termId
  );
};

/**
 * Get the current schedule's major from the AppState
 * @param state the AppState
 */
export const getActivePlanMajorFromState = (state: AppState) => {
  return getActivePlanFromState(state).major;
};

/**
 * Get the current schedule's coop cycle from the AppState
 * @param state the AppState
 */
export const getActivePlanCoopCycleFromState = (state: AppState) => {
  return getActivePlanFromState(state).coopCycle;
};

/**
 * Get the list of schedule names from the AppState
 * @param state the AppState
 */
export const getUserPlansFromState = (state: AppState): IPlanData[] =>
  Object.values(state.userPlansState.plans);

/**
 * Get the active schedule from the AppState
 * @param state the AppState
 */
export const getActivePlanFromState = (state: AppState): IPlanData => {
  return state.userPlansState.plans[state.userPlansState.activePlan!];
};

export const getActivePlanScheduleFromState = (state: AppState) => {
  return getActivePlanFromState(state).schedule;
};

export const getClosedYearsFromState = (state: AppState) => {
  return new Set(
    state.userPlansState.closedYears[state.userPlansState.activePlan!]
  );
};

/**
 * Get the active current class counter from the AppState
 * @param state the AppState
 */
export const getCurrentClassCounterFromState = (state: AppState) => {
  return getActivePlanFromState(state).courseCounter;
};

/**
 * Get whether the current user is an advisor or not
 * @param state the AppState
 */
export const getIsAdvisorFromState = (state: AppState) => {
  return getUserFromState(state).isAdvisor;
};

/*
 * SAFE GET FUNCTIONS
 * Should only need to use these where there is not guaranteed to have an active plan (like the home screen)
 * TODO: look into if a separate component (prior to getting to the HomeComponent) to load plan data would be worth it
 */

export const safelyGetActivePlanFromState = (state: AppState) => {
  if (!state.userPlansState.activePlan) {
    return undefined;
  }
  return state.userPlansState.plans[state.userPlansState.activePlan];
};

export const safelyGetActivePlanMajorFromState = (state: AppState) => safelyGetActivePlanFromState(state)?.major;

export const safelyGetActivePlanCoopCycleFromState = (state: AppState) => safelyGetActivePlanFromState(state)?.coopCycle;

export const safelyGetWarningsFromState = (state: AppState) => safelyGetActivePlanFromState(state)?.warnings || [];