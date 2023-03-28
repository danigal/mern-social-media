import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state"; // Import the reducer
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
// redux-persist is a library that allows us to save the state of the app locally and when the app is reloaded, the state is still there
// The only way the user can get rid of the state is if they clear their browser cache
// Session storage is an alternative to local storage, it will keep the state of the app but when the user closes the tab, the state is gone
import { // Import the persistStore and persistReducer if you use Redux Persist
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
// With PersistGate we can save the state of the app locally and when the app is reloaded, the state is still there

// index.js is the entry point of the app, it will render the app

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
// it will take the reducer and persist it
// I obtain this information from the Redux JS Toolkit and Redux Persist documentation
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Provider is a component that will wrap the app and it will give the app access to the store
// The PersistGate component will wait for the store to be rehydrated and then it will render the app
// The loading prop is optional, it will show a loading screen while the store is being rehydrated
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
