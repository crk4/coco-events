import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  open: false,
  severity: "success",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.message = action.payload.message;
      state.open = action.payload.open;
      state.severity = action.payload.severity || "success";
    },
  },
});

export const { showSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
