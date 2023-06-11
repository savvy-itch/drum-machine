import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  volume: .5
}

const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    changeVolume(state, action) {
      return {...state, volume: action.payload.volume / 100}
    },
  }
})

export const { changeVolume } = volumeSlice.actions;
export default volumeSlice.reducer;