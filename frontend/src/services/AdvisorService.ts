import { getAuthToken } from "../utils/auth-helpers";

/* Service function object to find all students given a search query
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
  }).then(response => response.json());
