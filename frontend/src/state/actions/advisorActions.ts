import { createAction } from "typesafe-actions";
import { IAdvisorData, IComment } from "../../models/types";

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

export const setCommentsAction = createAction(
  "advisor/SET_COMMENTS",
  (comments: IComment[]) => ({
    comments,
  })
)();

export const addCommentAction = createAction(
  "advisor/ADD_COMMENT",
  (comment: IComment) => ({
    comment,
  })
)();
