import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminId: "",
  adminName: "",
  adminRole: ""
};

const adminDetailsSlice = createSlice({
  name: "adminDetails",
  initialState,
  reducers: {
    assignAdminDetails: (state, action) => {
        state.adminId = action.payload._id;
        state.adminName = action.payload.name;
        state.adminRole = action.payload.role;
    },
    removeAdminDetails: (state) => {
        state.adminId = "";
        state.adminName = "";
        state.adminRole = "";
    },
  },
});

export const {assignAdminDetails, removeAdminDetails} = adminDetailsSlice.actions;

export default adminDetailsSlice.reducer;
