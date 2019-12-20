import { Schedule } from "../../models/types";
import { createAction } from "typesafe-actions";

/**
 * Action creators
 */

export const fetchPlansPendingAction = createAction(
  "plans/FETCH_PLANS_PENDING",
  () => ({})
)();

export const fetchPlansSuccessAction = createAction(
  "plans/FETCH_PLANS_SUCCESS",
  (plans: Record<string, Schedule[]>) => ({
    plans,
  })
)();

export const fetchPlansErrorAction = createAction(
  "plans/FETCH_PLANS_ERROR",
  (plansError: string) => ({
    plansError,
  })
)();
