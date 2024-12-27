import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
};

const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    assignAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    removeAccessToken: (state) => {
      state.accessToken = "";
    },
  },
});

export const { assignAccessToken, removeAccessToken } =
  accessTokenSlice.actions;

export default accessTokenSlice.reducer;
