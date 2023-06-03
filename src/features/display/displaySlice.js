import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentName: 'Heater Kit',
}

const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    displayName(state, action) {
      return {...state, currentName: action.payload.currentName}
    }
  }
})

export const { displayName } = displaySlice.actions;
export default displaySlice.reducer;