import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
};

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    saveTickets: (state, action) => {
      state.tickets = action.payload;
    },
    updateTicket: (state, action) => {
      state.tickets = [...state.tickets, action.payload];
    },
  },
});

export const { updateTicket, saveTickets } = ticketSlice.actions;

export default ticketSlice.reducer;
