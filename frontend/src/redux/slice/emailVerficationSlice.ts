import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emailVerfied: false,
};

const emailVerficationSlice = createSlice({
  name: "emailVerfication",
  initialState,
  reducers: {
    emailNotVerfied: (state) => {
      state.emailVerfied = false;
    },
    emailVerfiedTrue: (state) => {
      state.emailVerfied = true;
    },
  },
});

export const {emailNotVerfied, emailVerfiedTrue} = emailVerficationSlice.actions;

export default emailVerficationSlice.reducer;
