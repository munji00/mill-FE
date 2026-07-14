import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "@/app/services/api/baseApi";

import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import uiReducer from "./slices/uiSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notification: notificationReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});