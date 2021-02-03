import {
  ILoginData,
  IUpdateUser,
  IUpdateUserData,
  IUpdateUserPassword,
} from "../models/types";

// unused right now as Khoury auth is being used
export const registerUser = (user: IUpdateUserData) =>
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

export const simulateKhouryStudentLogin = () =>
  fetch(`/api/v1/admin_hook`, {
    method: "POST",
    body: JSON.stringify({
      email: "a.grob@northeastern.edu",
      nu_id: "001234567",
      is_advisor: false,
      major: "Computer Science, BSCS",
      first_name: "Alexander",
      last_name: "Grob",
      courses: [
        {
          subject: "CS",
          course_id: "2500",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "1800",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "ENGW",
          course_id: "1111",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "1200",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "GAME",
          course_id: "2500",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "2501",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "1802",
          semester: "201910",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "2801",
          semester: "201930",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "2800",
          semester: "201930",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "2510",
          semester: "201930",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "2511",
          semester: "201930",
          completion: "PASSED",
        },
        {
          subject: "ARTF",
          course_id: "1122",
          semester: "201930",
          completion: "PASSED",
        },
        {
          subject: "PHIL",
          course_id: "1145",
          semester: "201930",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "3000",
          semester: "201940",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "3200",
          semester: "201940",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "3500",
          semester: "202010",
          completion: "PASSED",
        },
        {
          subject: "MATH",
          course_id: "2331",
          semester: "202010",
          completion: "PASSED",
        },
        {
          subject: "MATH",
          course_id: "3081",
          semester: "202010",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "3650",
          semester: "202010",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "3950",
          semester: "202010",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "4400",
          semester: "202030",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "1210",
          semester: "202030",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "3700",
          semester: "202030",
          completion: "PASSED",
        },
        {
          subject: "DS",
          course_id: "3000",
          semester: "202030",
          completion: "PASSED",
        },
        {
          subject: "ENGW",
          course_id: "3302",
          semester: "202030",
          completion: "PASSED",
        },
        {
          subject: "COOP",
          course_id: "3945",
          semester: "202060",
          completion: "PASSED",
        },
        {
          subject: "COOP",
          course_id: "3945",
          semester: "202110",
          completion: "PASSED",
        },
        {
          subject: "ARTG",
          course_id: "2251",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "ARTG",
          course_id: "2252",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "ARTG",
          course_id: "2250",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "CS",
          course_id: "4500",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "EECE",
          course_id: "2322",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "EECE",
          course_id: "2323",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "ARTF",
          course_id: "1123",
          semester: "202130",
          completion: "PASSED",
        },
        {
          subject: "MATH",
          course_id: "1341",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "MATH",
          course_id: "1342",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "CHEM",
          course_id: "1211",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "CHEM",
          course_id: "1212",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "CHEM",
          course_id: "1214",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "CHEM",
          course_id: "1215",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "PHYS",
          course_id: "1151",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "PHYS",
          course_id: "1152",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "PHYS",
          course_id: "1153",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "PSYC",
          course_id: "1101",
          semester: null,
          completion: "TRANSFER",
        },
        {
          subject: "HIST",
          course_id: "1130",
          semester: null,
          completion: "TRANSFER",
        },
      ],
      photo_url:
        "https://prod-web.neu.edu/wasapp/EnterprisePhotoService/PhotoServlet?vid=CCS&er=d1d26b1327817a8d34ce75336e0334cb78f33e63cf907ea82da6d6abcfc15d66244bb291baec1799cf77970e4a519a1cf7d48edaddb97c01",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());

export const simulateKhouryAdvisorLogin = () =>
  fetch(`/api/v1/admin_hook`, {
    method: "POST",
    body: JSON.stringify({
      email: "a.ressing@northeastern.edu",
      is_advisor: true,
      first_name: "Ali",
      last_name: "Ressing",
      photo_url:
        "https://prod-web.neu.edu/wasapp/EnterprisePhotoService/PhotoServlet?vid=CCS&er=d1d26b1327817a8d34ce75336e0334cb78f33e63cf907ea82da6d6abcfc15d66244bb291baec1799cf77970e4a519a1cf7d48edaddb97c01",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
