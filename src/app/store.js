import { configureStore } from '@reduxjs/toolkit';
import switchesReducer from "../features/switches/switchesSlice";
import displayReducer from "../features/display/displaySlice";

export const store = configureStore({
  reducer: {
    switches: switchesReducer,
    display: displayReducer,
  },
});