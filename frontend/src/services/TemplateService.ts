import {
  ICreateTemplatePlan,
  IFolderData,
  ITemplatePlan,
  IUpdateTemplatePlan,
} from "../models/types";
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
  userId: number,
  searchQuery?: string,
  pageNumber?: number
): Promise<TemplatesAPI> =>
  fetch(
    `/api/users/${userId}/templates${
      pageNumber !== undefined
        ? `?search=${searchQuery}&page=${pageNumber}`
        : ""
    }`,
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
 * @param template the template information
 */
export const createTemplate = (
  userId: number,
  template: ICreateTemplatePlan
): Promise<{ templatePlan: ITemplatePlan }> =>
  fetch(`/api/users/${userId}/templates`, {
    method: "POST",
    body: JSON.stringify({ template_plan: template }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

/**
 *
 * @param userId
 * @param templateId
 */
export const fetchTemplate = (userId: number, templateId: number) =>
  fetch(`/api/users/${userId}/templates/${templateId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());

/**
 * Updates a given template plan for the given advisor.
 * @param userId the id of the user who's plan is being modified
 * @param planId  the id of the plan being updated
 * @param templatePlan  the plan object to be used as the current plan
 */
export const updateTemplatePlanForUser = (
  userId: number,
  planId: number,
  templatePlan: IUpdateTemplatePlan
) =>
  fetch(`/api/users/${userId}/templates/${planId}`, {
    method: "PUT",
    body: JSON.stringify({ template_plan: templatePlan }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
