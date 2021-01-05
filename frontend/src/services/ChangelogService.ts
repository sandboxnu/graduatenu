import { IChangeLog } from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";

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
