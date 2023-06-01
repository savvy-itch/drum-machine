import { configureStore } from '@reduxjs/toolkit';
import switchesReducer from "../features/switches/switchesSlice";

export const store = configureStore({
  reducer: {
    switches: switchesReducer
  },
});