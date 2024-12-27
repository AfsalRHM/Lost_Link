import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userName: "",
  userRole: ""
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    assignUserDetails: (state, action) => {
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.userRole = "user";
    },
    removeUserDetails: (state) => {
        state.userId = "";
        state.userName = "";
        state.userRole = "";
    },
  },
});

export const {assignUserDetails, removeUserDetails} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
