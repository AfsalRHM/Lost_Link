import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: "",
};

const currentPageSlice = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    assignCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { assignCurrentPage } = currentPageSlice.actions;

export default currentPageSlice.reducer;
