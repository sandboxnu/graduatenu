import { getAuthToken } from "../utils/auth-helpers";

export const fetchAppointments = (advisor_id: number) => 
  fetch(`/api/users/${advisor_id}/appointments`, {
    method: "GET",
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
  