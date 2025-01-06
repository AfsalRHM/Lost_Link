import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerStepReducer from "./slice/registerStepSlice";
import emailVerficationReducer from "./slice/emailVerficationSlice";
import registerDetailsReducer from "./slice/registerDetails";
import userDetailsReducer from "./slice/userDetailsSlice";
import currentPageReducer from "./slice/currentPageSlice";
import adminDetailsReducer from "./slice/adminDetailsSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import accessTokenReducer from "./slice/accessTokenSlice";

const rootReducer = combineReducers({
  registerStep: registerStepReducer,
  emailVerfication: emailVerficationReducer,
  registerDetails: registerDetailsReducer,
  accessToken: accessTokenReducer,
  userDetails: userDetailsReducer,
  currentPage: currentPageReducer,
  adminDetails: adminDetailsReducer
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// persistor.purge()

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
