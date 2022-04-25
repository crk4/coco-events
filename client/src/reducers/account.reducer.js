import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accounts: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    saveAccounts: (state, action) => {
      state.accounts = action.payload;
    },
  },
});

export const { saveAccounts } = accountSlice.actions;

export default accountSlice.reducer;
