import produce from "immer";
import { getType } from "typesafe-actions";
import { IAdvisorData, IComment } from "../../models/types";
import { AdvisorAction } from "../actions";
import {
  setAdvisorAction,
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
    }
  });
};
