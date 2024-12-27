import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
};

const registerStepSlice = createSlice({
  name: "registerStep",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    resetStep: (state) => {
      state.step = 1;
    },
  },
});

export const {nextStep, prevStep, resetStep} = registerStepSlice.actions;

export default registerStepSlice.reducer;