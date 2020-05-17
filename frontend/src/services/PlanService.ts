import { IPlanData } from "../models/types";

export const findAllPlansForUser = (userId: number, userToken: string) =>
  fetch(`/api/users/${userId}/plans`, {
    method: "GET",
    headers: {
      Authorization: "Token " + userToken,
    },
  }).then(response => response.json());

export const createPlanForUser = (
  userId: number,
  userToken: string,
  plan: IPlanData
) =>
  fetch(`/api/users/${userId}/plans`, {
    method: "POST",
    body: JSON.stringify({ plan: plan }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + userToken,
    },
  }).then(response => response.json());
