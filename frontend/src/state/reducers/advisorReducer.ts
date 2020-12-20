import produce from "immer";
import { getType } from "typesafe-actions";
import { AdvisorAction } from "../actions";
import {
  setEmail,
  setImage,
  setName,
  setStudents,
  setUserId,
  toggleTemplateFolderExpandedAction,
} from "../actions/advisorActions";

export interface Student {
  readonly email: string;
  readonly name: string;
}

export interface AdvisorState {
  readonly email: string;
  readonly name: string;
  readonly userId?: number;
  readonly image: string;
  readonly students: Array<Student>;
  readonly closedFolders: Array<number>;
}

const initialState: AdvisorState = {
  email: "",
  name: "",
  userId: undefined,
  image: "",
  students: [],
  closedFolders: [],
};

export const advisorReducer = (
  state: AdvisorState = initialState,
  action: AdvisorAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setEmail): {
        draft.email = action.payload.email;
        return draft;
      }

      case getType(setName): {
        draft.name = action.payload.name;
        return draft;
      }

      case getType(setUserId): {
        draft.userId = action.payload.userId;
        return draft;
      }

      case getType(setImage): {
        draft.image = action.payload.image;
        return draft;
      }

      case getType(setStudents): {
        draft.students = action.payload.students;
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
