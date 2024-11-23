import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Reducers/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
