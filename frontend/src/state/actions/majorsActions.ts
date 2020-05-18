import { Major } from "graduate-common";
import { createAction } from "typesafe-actions";

/**
 * Action creators
 */

/**
 * an action that tells the store that a fetch for majors was initiated.
 */
export const fetchMajorsPendingAction = createAction(
  "majors/FETCH_MAJORS_PENDING",
  () => ({})
)();

/**
 * an action that tells the store that a majors were successfully fetched.
 */
export const fetchMajorsSuccessAction = createAction(
  "majors/FETCH_MAJORS_SUCCESS",
  (majors: Major[]) => ({
    majors,
  })
)();

/**
 * an action that tells the store that there was an error when fetching majors.
 */
export const fetchMajorsErrorAction = createAction(
  "majors/FETCH_MAJORS_ERROR",
  (majorsError: string) => ({
    majorsError,
  })
)();
