import produce from "immer";
import { getType } from "typesafe-actions";
import { AdvisorAction } from "../actions";
import {
  setAdvisorAction,
  setEmail,
  setImage,
  setName,
  setStudents,
  setUserId,
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
}

const initialState: AdvisorState = {
  email: "",
  name: "",
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
      case getType(setAdvisorAction): {
        const { fullName, email, id } = action.payload.advisor;
        draft.name = fullName;
        draft.email = email;
        draft.userId = id;
        return draft;
      }

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
    }
  });
};
