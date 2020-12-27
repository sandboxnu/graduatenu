import { getAuthToken } from "../utils/auth-helpers";

/** Service function object to find all students given a search query
 * @param searchQuery  the search query
 * @param pageNumber  page number for the query
 * @param userToken the JWT token of the user
 */
export const getStudents = (searchQuery: string, pageNumber: number) =>
  fetch(`/api/users/students?search=${searchQuery}&page=${pageNumber}`, {
    method: "GET",
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

export const getAdvisors = () =>
  fetch(`/api/users/advisors`, {
    method: "GET",
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  })
    .then(response => response.json())
    .catch(error => console.log(error));

/**
 * Service function object to allow advisors to get a specific user's information
 * @param userId the student's userId
 * @param token the JWT token of the user
 */
export const fetchUser = (userId: number) =>
  fetch(`/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
