import {
  ILoginData,
  IUpdateUser,
  IUpdateUserData,
  IUpdateUserPassword,
  IUserData,
} from "../models/types";

export const registerUser = (user: IUpdateUserData) =>
  fetch(`/api/users`, {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

interface UserDataWithToken extends IUserData {
  token: string;
}

interface LoginUserData {
  errors?: any;
  user?: UserDataWithToken;
}

interface LoginUserResponse {
  status: number;
  data: LoginUserData;
}

export const loginUser = (user: ILoginData): Promise<LoginUserResponse> =>
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => {
    return { status: response.status, data: response.json() as LoginUserData };
  });

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

/**
 * Service function object to get the user data of the logged in user
 * @param token
 */
export const fetchActiveUser = (token: string) =>
  fetch(`/api/users/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
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
