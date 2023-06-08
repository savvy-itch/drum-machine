import { configureStore } from '@reduxjs/toolkit';
import switchesReducer from "../features/switches/switchesSlice";
import displayReducer from "../features/display/displaySlice";
import volumeReducer from "../features/volume/volumeSlice";

export const store = configureStore({
  reducer: {
    switches: switchesReducer,
    display: displayReducer,
    volume: volumeReducer,
  },
});