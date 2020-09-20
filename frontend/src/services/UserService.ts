import {
  IUserData,
  ILoginData,
  IUpdateUser,
  IUpdateUserData,
  IUpdateUserPassword,
} from "../models/types";

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

/**
 * Service function object to update the user data
 * @param userData
 */
export const updateUser = (user: IUpdateUser, userData: IUpdateUserData) =>
  fetch(`/api/users/${user.id}`, {
    method: "PUT",
    body: JSON.stringify({ user: userData }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + user.token,
    },
  }).then(response => response.json());

/**
 * Service function object to update the user data
 * @param userData
 */
export const updatePassword = (
  token: string,
  userPassword: IUpdateUserPassword
) =>
  fetch(`/api/users/password`, {
    method: "PUT",
    body: JSON.stringify({ user: userPassword }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
  }).then(response => response.json());
