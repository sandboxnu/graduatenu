import produce from "immer";
import { getType } from "typesafe-actions";
import { AdvisorAction } from "../actions";
import {
  setEmail,
  setImage,
  setName,
  setStudents,
  setToken,
  setUserId,
} from "../actions/advisorActions";

export interface Student {
  readonly email: string;
  readonly name: string;
}

export interface AdvisorState {
  readonly email: string;
  readonly name: string;
  readonly token?: string;
  readonly userId?: number;
  readonly image: string;
  readonly students: Array<Student>;
}

const initialState: AdvisorState = {
  email: "",
  name: "",
  token: undefined,
  userId: undefined,
  image: "",
  students: [],
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

      case getType(setToken): {
        draft.token = action.payload.token;
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
    }
  });
};
