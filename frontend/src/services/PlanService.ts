import { ICreatePlanData, IPlanData, DNDSchedule } from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";

/**
 * Service function object to find all plans for a given User.
 * @param userId  the user id of the user to be searched
 * @param userToken the JWT token of the user to be searched
 */
export const findAllPlansForUser = (
  userId: number,
  userToken: string
): Promise<IPlanData[]> =>
  fetch(`/api/users/${userId}/plans`, {
    method: "GET",
    headers: {
      Authorization: "Token " + userToken,
    },
  }).then(response =>
    response.json().then((plans: IPlanData[]) => {
      return plans.map((plan: IPlanData) => ({
        ...plan,
        lastViewed: new Date(plan.lastViewed), // convert string timestamp to a Date object
      }));
    })
  );

/**
 * Service function object to create a given plan for a given user.
 * @param userId  the id of the user to be modified
 * @param userToken the JWT token of the user to be modified
 * @param plan  the plan object to be created for this user
 */
export const createPlanForUser = (
  userId: number,
  userToken: string,
  plan: ICreatePlanData
) =>
  fetch(`/api/users/${userId}/plans`, {
    method: "POST",
    body: JSON.stringify({ plan: plan }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + userToken,
    },
  }).then(response => response.json());

/**
 * Service function object to delete a specified plan for a given user.
 * @param userId  the id of the user to be modified
 * @param planId the id of the plan to be deleted
 * @param userToken the JWT token of the user to be modified
 */
export const deletePlanForUser = (
  userId: number,
  planId: number,
  userToken: string
) =>
  fetch(`/api/users/${userId}/plans/${planId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + userToken,
    },
  }).then(response => response.json());

/**
 * Updates a given plan for the given user.
 * @param userId the id of the user who's plan is being modified
 * @param userToken the JWT token of the user who's plan is being modified
 * @param planId  the id of the plan being updated
 * @param plan  the plan object to be used as the current plan
 */
export const updatePlanForUser = (
  userId: number,
  planId: number,
  plan: Partial<ICreatePlanData>
) =>
  fetch(`/api/users/${userId}/plans/${planId}`, {
    method: "PUT",
    body: JSON.stringify({ plan: plan }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
