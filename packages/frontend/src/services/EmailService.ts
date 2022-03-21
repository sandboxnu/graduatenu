import { getAuthToken } from "../utils/auth-helpers";

export const sendEmail = (
  studentEmail: string,
  advisorEmail: string,
  planId: number
) =>
  fetch(`/api/mail/request_approval`, {
    method: "POST",
    body: JSON.stringify({
      student_email: studentEmail,
      advisor_email: advisorEmail,
      plan_id: planId,
    }),
    headers: {
      Authorization: "Token " + getAuthToken(),
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
