/* Service function object to find all students given a search query
 * @param searchQuery  the search query
 * @param userToken the JWT token of the user
 */
export const getStudents = (searchQuery: string, userToken: string) =>
  fetch(`/api/users/all_students`, {
    method: "GET",
    headers: {
      Authorization: "Token " + userToken,
    },
  }).then(response => response.json());
