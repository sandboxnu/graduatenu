import { IFolderData } from "../models/types";

export interface TemplatesAPI {
  templates: IFolderData[];
  nextPage: number;
  lastPage: boolean;
}

/** Service function object to return all of an advisor's templates
 * @param userId the user id to get the templates from (usually the current user id)
 * @param userToken the JWT token of the user
 */
export const getTemplates = (
  searchQuery: string,
  pageNumber: number,
  userId: number,
  userToken: string
): Promise<TemplatesAPI> =>
  fetch(
    `/api/users/${userId}/templates?search=${searchQuery}&page=${pageNumber}`,
    {
      method: "GET",
      headers: {
        Authorization: "Token " + userToken,
      },
    }
  ).then(response =>
    response.json().then((result: TemplatesAPI) => {
      result.templates.map((folder: IFolderData) => {
        folder.templatePlans.forEach(tp => {
          tp.updatedAt = new Date(tp.updatedAt); // set to date object
        });

        return folder;
      });
      return result;
    })
  );
