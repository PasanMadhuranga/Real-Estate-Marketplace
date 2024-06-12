// Redux is a pattern and library for managing and updating application state, using events called "actions".
// It serves as a centralized store for state that needs to be used across your entire application,
// with rules ensuring that the state can only be updated in a predictable fashion.

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

// persistReducer and persistStore from redux-persist: Used to add persistence capabilities to the Redux store, 
// enabling the state to be saved to and rehydrated from local storage.
import { persistReducer, persistStore } from "redux-persist";

// storage from redux-persist/lib/storage: Specifies the storage engine to use for persisting the state, 
// in this case, local storage.
import storage from "redux-persist/lib/storage";

// Combines Reducers: Combines multiple slice reducers (in this case, just the userReducer) into a root reducer.
const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// State Persistence: Enhances the root reducer with persistence capabilities using redux-persist, allowing the state to be saved to and loaded from local storage.
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// middleware is used to extend or customize the middleware in your Redux store.
// getDefaultMiddleware is a function provided by Redux Toolkit that returns the default middleware for a Redux store.
// The serializableCheck option is set to false.
// By default, Redux Toolkit includes a middleware that checks if all actions and state are serializable.
// This can catch common mistakes, but sometimes you might need to disable it, for example,
// if you're using non-serializable data in your actions or state.


// persistStore: Creates a persistor object that controls the persistence layer of the store. 
// This is typically used to purge or rehydrate the state and manage the persistence lifecycle.
export const persistor = persistStore(store);
