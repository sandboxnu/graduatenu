import { createStore, applyMiddleware } from "redux";
import { logger } from "redux-logger";
import { rootReducer, AppState } from "./reducers/state";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore(initialState?: AppState) {
  const middleware = applyMiddleware(logger);

  const store = createStore(persistedReducer, initialState, middleware);
  const persistor = persistStore(store);
  return { store, persistor };
}
