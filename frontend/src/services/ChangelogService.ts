import { IChangeLog } from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";

/**
 * Sends a comment for a plan
 */
export const sendChangeLog = (
  planId: number,
  userId: number,
  log: string
): Promise<IChangeLog> =>
  fetch(`/api/users/${userId}/plans/${planId}/plan_changelogs/`, {
    method: "POST",
    body: JSON.stringify({ log: log }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
