import { Major } from "../../models/types";
import { createAction } from "typesafe-actions";

const FETCH_MAJORS_PENDING = "FETCH_PRODUCTS_PENDING";
const FETCH_MAJORS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
const FETCH_MAJORS_ERROR = "FETCH_PRODUCTS_ERROR";

/**
 * Action creators
 */

export const fetchMajorsPendingAction = createAction(
  "majors/FETCH_PRODUCTS_PENDING",
  () => ({})
)();

export const fetchMajorsSuccessAction = createAction(
  "majors/FETCH_PRODUCTS_SUCCESS",
  (majors: Major[]) => ({
    majors,
  })
)();

export const fetchMajorsErrorAction = createAction(
  "majors/FETCH_PRODUCTS_ERROR",
  (majorsError: string) => ({
    majorsError,
  })
)();
