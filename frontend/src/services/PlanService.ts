import {
  ICreatePlanData,
  IPlanData,
  IUpdatePlanData,
  IComment,
  IChangeLog,
} from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";

/**
 * Service function object to find all plans for a given User.
 * @param userId  the user id of the user to be searched
 * @param userToken the JWT token of the user to be searched
 */
export const findAllPlansForUser = (userId: number): Promise<IPlanData[]> =>
  fetch(`/api/users/${userId}/plans`, {
    method: "GET",
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response =>
    response.json().then((plans: IPlanData[]) => {
      return plans.map((plan: IPlanData) => ({
        ...plan,
        lastViewed: new Date(plan.lastViewed), // convert string timestamp to a Date object
        updatedAt: new Date(plan.updatedAt), // convert string timestamp to a Date object
      }));
    })
  );

/**
 * Service function object to find all plans for a given User.
 * @param userId  the user id of the user to be searched
 * @param userToken the JWT token of the user to be searched
 */
export const fetchPlan = (userId: number, planId: number): Promise<IPlanData> =>
  fetch(`/api/users/${userId}/plans/${planId}`, {
    method: "GET",
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response =>
    response.json().then((result: any) => {
      const plan = result.plan;
      return {
        ...plan,
        lastViewed: new Date(plan.lastViewed), // convert string timestamp to a Date object
        updatedAt: new Date(plan.updatedAt), // convert string timestamp to a Date object
      };
    })
  );

/**
 * Service function object to create a given plan for a given user.
 * @param userId  the id of the user to be modified
 * @param userToken the JWT token of the user to be modified
 * @param plan  the plan object to be created for this user
 */
export const createPlanForUser = (userId: number, plan: ICreatePlanData) =>
  fetch(`/api/users/${userId}/plans`, {
    method: "POST",
    body: JSON.stringify({ plan: plan }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token ",
    },
  }).then(response => response.json());

/**
 * Service function object to delete a specified plan for a given user.
 * @param userId  the id of the user to be modified
 * @param planId the id of the plan to be deleted
 * @param userToken the JWT token of the user to be modified
 */
export const deletePlanForUser = (userId: number, planId: number) =>
  fetch(`/api/users/${userId}/plans/${planId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
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
  plan: Partial<IUpdatePlanData>
) =>
  fetch(`/api/users/${userId}/plans/${planId}`, {
    method: "PUT",
    body: JSON.stringify({ plan: plan }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

export const approvePlanForUser = (
  userId: number,
  planId: number,
  schedule: any
) =>
  fetch(`/api/users/${userId}/plans/${planId}/approve`, {
    method: "PUT",
    body: JSON.stringify({ plan: { approved_schedule: schedule } }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

export const updatePlanLastViewed = (
  userId: number,
  planId: number,
  currentUserId: number
) =>
  fetch(`/api/users/${userId}/plans/${planId}/last_viewed`, {
    method: "PUT",
    body: JSON.stringify({ plan: { last_viewer: currentUserId } }), // sets last_viewed in the backend
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

export const requestApproval = (
  userId: number,
  advisorEmail: string,
  planId: number
) =>
  fetch(`/api/users/${userId}/plans/${planId}/request_approval`, {
    method: "PUT",
    body: JSON.stringify({ plan: { advisor_email: advisorEmail } }),
    headers: {
      Authorization: "Token " + getAuthToken(),
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

export const setPrimaryPlan = (userId: number, planId: number) =>
  fetch(`/api/users/${userId}/plans/${planId}/set_primary`, {
    method: "PUT",
    headers: {
      Authorization: "Token " + getAuthToken(),
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

/**
 * Gets changelogs for a plan
 * @param planId The id of the plan
 * @param studentId The id of the student
 */
export const fetchChangelogs = (planId: number, studentId: number) =>
  fetch(`/api/users/${studentId}/plans/${planId}/plan_changelogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response =>
    response.json().then((changeLogs: IChangeLog[]) => {
      return changeLogs.map((changeLog: IChangeLog) => ({
        ...changeLog,
        createdAt: new Date(changeLog.createdAt), // convert string timestamp to a Date object
        updatedAt: new Date(changeLog.updatedAt), // convert string timestamp to a Date object
      }));
    })
  );

/**
 * Sends a comment for a plan
 */
export const sendChangeLog = (
  planId: number,
  studentId: number,
  authorId: number,
  log: string
): Promise<IChangeLog> =>
  fetch(`/api/users/${studentId}/plans/${planId}/plan_changelogs/`, {
    method: "POST",
    body: JSON.stringify({ log: log, author_id: authorId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

/**
 * Gets comments for a plan
 * @param planId The id of the plan
 * @param studentId The id of the student
 */
export const fetchComments = (planId: number, studentId: number) =>
  fetch(`/api/users/${studentId}/plans/${planId}/plan_comments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response =>
    response.json().then((comments: IComment[]) => {
      return comments.map((comment: IComment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt), // convert string timestamp to a Date object
        updatedAt: new Date(comment.updatedAt), // convert string timestamp to a Date object
      }));
    })
  );

/**
 * Sends a comment for a plan
 */
export const sendComment = (
  planId: number,
  studentId: number,
  author: string,
  comment: string
): Promise<IComment> =>
  fetch(`/api/users/${studentId}/plans/${planId}/plan_comments/`, {
    method: "POST",
    body: JSON.stringify({ author: author, comment: comment }),

    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response =>
    response.json().then(comment => {
      const { planComment } = comment;
      return {
        ...planComment,
        createdAt: new Date(planComment.createdAt), // convert string timestamp to a Date object
        updatedAt: new Date(planComment.updatedAt), // convert string timestamp to a Date object
      };
    })
  );
