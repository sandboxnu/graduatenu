import { Store, createStore, applyMiddleware } from "redux";
import { logger } from "redux-logger";
import { rootReducer, AppState } from "./reducers/state";

export function configureStore(initialState?: AppState): Store<AppState> {
  const middleware = applyMiddleware(logger);

  return createStore(rootReducer, initialState, middleware);
}
