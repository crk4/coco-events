import { eventSlice } from "../reducers/event.reducer";
import { snackbarSlice } from "../reducers/snackbar.reducer";
import { ticketSlice } from "../reducers/ticket.reducer";

export const rootReducer = {
  event: eventSlice.reducer,
  snackbar: snackbarSlice.reducer,
  ticket: ticketSlice.reducer,
};
