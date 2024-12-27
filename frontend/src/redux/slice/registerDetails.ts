import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userFullName: "",
  userName: "",
  userLocation: "",
  userEmail: "",
  userPassword: "",
};

const registerDetailsSlice = createSlice({
  name: "registerDetails",
  initialState,
  reducers: {
    assignUserFullName: (state, action) => {
      state.userFullName = action.payload;
    },
    assignUserName: (state, action) => {
      state.userName = action.payload;
    },
    assignUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    assignUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    assignUserPassword: (state, action) => {
      state.userPassword = action.payload;
    },
    makeEmptyUserDetails: (state) => {
        state.userFullName = "",
        state.userName = "",
        state.userLocation = "",
        state.userEmail = "",
        state.userPassword = ""
    }
  },
});

export const {
  assignUserFullName,
  assignUserName,
  assignUserLocation,
  assignUserEmail,
  assignUserPassword,
  makeEmptyUserDetails
} = registerDetailsSlice.actions;

export default registerDetailsSlice.reducer;
