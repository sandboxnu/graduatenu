import { IFolderData } from "../models/types";

/** Service function object to return all of an advisor's templates
 * @param userId the user id to get the templates from (usually the current user id)
 * @param userToken the JWT token of the user
 */
export const getTemplates = (
  userId: string,
  userToken: string
): Promise<IFolderData[]> =>
  fetch(`/api/users/${userId}/templates`, {
    method: "GET",
    headers: {
      Authorization: "Token " + userToken,
    },
  }).then(response =>
    response.json().then((folders: IFolderData[]) => {
      return folders.map((folder: IFolderData) => {
        folder.templatePlans.forEach(tp => {
          tp.updatedAt = new Date(tp.updatedAt); // set to date object
        });

        return folder;
      });
    })
  );
