/** Service function object to find all students given a search query
 * @param searchQuery  the search query
 * @param pageNumber  page number for the query
 * @param userToken the JWT token of the user
 */
export const getStudents = (
  searchQuery: string,
  pageNumber: number,
  userToken: string
) =>
  fetch(`/api/users/students?search=${searchQuery}&page=${pageNumber}`, {
    method: "GET",
    headers: {
      Authorization: "Token " + userToken,
    },
  }).then(response => response.json());

/**
 * Service function object to allow advisors to get a specific user's information
 * @param userId the student's userId
 * @param token the JWT token of the user
 */
export const fetchUser = (userId: number, token: string) =>
  fetch(`/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
  }).then(response => response.json());
