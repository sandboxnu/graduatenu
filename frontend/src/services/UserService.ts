import { IUserData, ILoginData } from "../models/types";

/**
 * Service function object to register a given User.
 * @param user  the given user object to be registered
 */
export const registerUser = (user: IUserData) =>
  fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

/**
 * Service function object to login as a given User.
 * @param user  the given user login data to be used
 */
export const loginUser = (user: ILoginData) =>
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
