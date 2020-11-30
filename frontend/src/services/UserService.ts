import {
  ILoginData,
  IUpdateUser,
  IUpdateUserData,
  IUpdateUserPassword,
  IUserData,
} from "../models/types";

// unused right now as Khoury auth is being used
export const registerUser = (user: IUserData) =>
  fetch(`/api/users`, {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

// unused right now as Khoury auth is being used
export const loginUser = (user: ILoginData) =>
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

// unused right now as Khoury auth is being used
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
 * Service function object to get the user data
 * @param token
 */
export const fetchUser = (token: string) =>
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

export const simulateKhouryLogin = () =>
  fetch(`/api/v1/admin_hook`, {
    method: "POST",
    body: JSON.stringify({
      email: "a.grob@northeastern.edu",
      nu_id: "001234567",
      is_advisor: false,
      major: "Computer Science, BSCS",
      first_name: "Alexander",
      last_name: "Grob",
      photo_url:
        "https://prod-web.neu.edu/wasapp/EnterprisePhotoService/PhotoServlet?vid=CCS&er=d1d26b1327817a8d34ce75336e0334cb78f33e63cf907ea82da6d6abcfc15d66244bb291baec1799cf77970e4a519a1cf7d48edaddb97c01",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
