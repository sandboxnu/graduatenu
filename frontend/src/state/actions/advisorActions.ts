import { createAction } from "typesafe-actions";
import { IAdvisorData } from "../../models/types";

export const setAdvisorAction = createAction(
  "advisor/SET_ADVISOR",
  (advisor: IAdvisorData) => ({ advisor })
)();

export const setImage = createAction("advisor/SET_IMAGE", (image: string) => ({
  image,
}))();

export const toggleTemplateFolderExpandedAction = createAction(
  "advisor/TOGGLE_TEMPLATE_FOLDER_EXPANDED",
  (index: number) => ({ index })
)();
