import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  adminAccessToken: ""
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
    assignAdminAccessToken: (state, action) => {
      state.adminAccessToken = action.payload;
    },
    removeAdminAccessToken: (state) => {
      state.adminAccessToken = "";
    },
  },
});

export const { assignAccessToken, removeAccessToken, assignAdminAccessToken, removeAdminAccessToken } =
  accessTokenSlice.actions;

export default accessTokenSlice.reducer;
