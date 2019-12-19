import { Major } from "../../models/types";
import { createAction } from "typesafe-actions";

/**
 * Action creators
 */

export const fetchMajorsPendingAction = createAction(
  "majors/FETCH_MAJORS_PENDING",
  () => ({})
)();

export const fetchMajorsSuccessAction = createAction(
  "majors/FETCH_MAJORS_SUCCESS",
  (majors: Major[]) => ({
    majors,
  })
)();

export const fetchMajorsErrorAction = createAction(
  "majors/FETCH_MAJORS_ERROR",
  (majorsError: string) => ({
    majorsError,
  })
)();
