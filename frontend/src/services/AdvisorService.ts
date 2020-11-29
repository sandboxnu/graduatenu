/* Service function object to find all students given a search query
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
