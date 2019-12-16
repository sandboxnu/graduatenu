<<<<<<< HEAD
import { createStore, applyMiddleware } from "redux";
=======
import { Store, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
>>>>>>> b503118... ys - create actions + reducers
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
  const middlewares = [thunk, logger];

  const store = createStore(
    persistedReducer,
    initialState,
    applyMiddleware(...middlewares)
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
