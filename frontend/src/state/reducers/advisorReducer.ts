import produce from "immer";
import { getType } from "typesafe-actions";
import { IAdvisorData, IComment } from "../../models/types";
import { AdvisorAction } from "../actions";
import {
  addCommentAction,
  setAdvisorAction,
  setCommentsAction,
  setImage,
  toggleTemplateFolderExpandedAction,
} from "../actions/advisorActions";

export interface AdvisorState {
  advisor?: IAdvisorData;
  closedFolders: number[];
  comments: IComment[];
}

const initialState: AdvisorState = {
  advisor: undefined,
  closedFolders: [],
  comments: [],
};

export const advisorReducer = (
  state: AdvisorState = initialState,
  action: AdvisorAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setAdvisorAction): {
        draft.advisor = action.payload.advisor;
        return draft;
      }
      case getType(setImage): {
        draft.advisor!.photoUrl = action.payload.image;
        return draft;
      }
      case getType(toggleTemplateFolderExpandedAction): {
        const idx = action.payload.index;
        if (draft.closedFolders.includes(idx)) {
          draft.closedFolders = draft.closedFolders.filter(
            folderNum => folderNum !== idx
          );
        } else {
          draft.closedFolders.push(idx);
        }
        return draft;
      }
      case getType(setCommentsAction): {
        draft.comments = action.payload.comments;
        return draft;
      }
      case getType(addCommentAction): {
        draft.comments.push(action.payload.comment);
        return draft;
      }
    }
  });
};
