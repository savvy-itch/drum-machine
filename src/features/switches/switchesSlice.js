import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  powerOff: false,
  bankIndex: 0,
}

const switchesSlice = createSlice({
  name: 'switches',
  initialState,
  reducers: {
    switchPower(state, action) {
      return {...state, powerOff: !action.payload.powerOff}
    },
    switchBank(state, action) {
      return {...state, bankIndex: action.payload.bankIndex}
    }
  }
})

export const { switchPower, switchBank } = switchesSlice.actions;
export default switchesSlice.reducer;