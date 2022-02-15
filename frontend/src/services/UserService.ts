import {
  ILoginData,
  IUpdateUser,
  IUpdateUserData,
  IUpdateUserPassword,
  IUserData,
} from "../models/types";
import { ServerResponse } from "./types";

interface UserDataWithToken extends IUserData {
  token: string;
}

export const registerUser = async (
  user: ILoginData
): Promise<ServerResponse<UserDataWithToken>> => {
  const response = await fetch(`/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ServerResponse<UserDataWithToken> = await response.json();

  return data;
};

export const loginUser = async (
  user: ILoginData
): Promise<ServerResponse<UserDataWithToken>> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ServerResponse<UserDataWithToken> = await response.json();

  console.log("Login data: ", data);

  return data;
};

export const logoutUser = async () => {
  const response = await fetch("/api/users/sign_out", {
    method: "DELETE",
  });

  return response.status;
};

export const updatePassword = async (
  token: string,
  userPassword: IUpdateUserPassword
) => {
  const response = await fetch(`/api/me`, {
    method: "PATCH",
    body: JSON.stringify({ password: userPassword }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

/**
 * Service function object to get the user data of the logged in user
 * @param token
 */
export const fetchActiveUser = async (token: string) => {
  const response = await fetch(`/api/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

/**
 * Service function object to update the user data
 * @param userData
 */
export const updateUser = async (
  user: IUpdateUser,
  updatedUser: IUpdateUserData
) => {
  const response = await fetch(`/api/me`, {
    method: "PUT",
    body: JSON.stringify(updatedUser),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });

  return response.json();
};
