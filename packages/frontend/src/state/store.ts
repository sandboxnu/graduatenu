import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { logger } from "redux-logger";
import { rootReducer, AppState } from "./reducers/state";
import { composeWithDevTools } from "redux-devtools-extension";

export function configureStore(initialState?: AppState) {
  const middlewares = [thunk, logger];

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
  return { store };
}
