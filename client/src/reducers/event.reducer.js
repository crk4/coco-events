import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    saveEvents: (state, action) => {
      state.events = action.payload;
    },
    updateEvent: (state, action) => {
      state.events = [...state.events, action.payload];
    },
  },
});

export const { updateEvent, saveEvents } = eventSlice.actions;

export default eventSlice.reducer;
