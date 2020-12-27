import { ICreateTemplatePlan, IFolderData } from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";

export interface TemplatesAPI {
  templates: IFolderData[];
  nextPage: number;
  lastPage: boolean;
}

/** Service function object to return all of an advisor's templates
 * @param searchQuery the search query for searching through the templates
 * @param pageNumber the current page number for the pagniaton of the route
 * @param userId the user id to get the templates from (usually the current user id)
 * @param userToken the JWT token of the user
 */
export const getTemplates = (
  searchQuery: string,
  pageNumber: number,
  userId: number
): Promise<TemplatesAPI> =>
  fetch(
    `/api/users/${userId}/templates?search=${searchQuery}&page=${pageNumber}`,
    {
      method: "GET",
      headers: {
        Authorization: "Token " + getAuthToken(),
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

/** Service function object to create a template in the backend
 * @param userId the user id to get the templates from (usually the current user id)
 * @param userToken the JWT token of the user
 */
export const createTemplate = (
  userId: number,
  template: ICreateTemplatePlan
): Promise<IFolderData> =>
  fetch(`/api/users/${userId}/templates`, {
    method: "POST",
    body: JSON.stringify({ templatePlan: template }),
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
