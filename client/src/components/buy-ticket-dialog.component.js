import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import getCocoEventsContractInstance from "../utils/getCocoEventsContract";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { showSnackbar } from "../reducers/snackbar.reducer";

export default function BuyTicketDialog(props) {
  const dispatch = useDispatch();
  const { open, closeDialog, event } = props;
  const accounts = useSelector((state) => state.account.accounts);

  const [ticketNumber, setTicketNumber] = React.useState("");
  const [loadingSold, setLoadingSold] = React.useState(true);
  const [soldTickets, setSoldTickets] = React.useState([]);
  const [bookingTicket, setBookingTicket] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      if (open) {
        const cocoEvents = await getCocoEventsContractInstance();
        setLoadingSold(true);
        cocoEvents.methods
          .getAllTicketsByEvent(event.tokenId)
          .call({ from: accounts[0] })
          .then((result) => {
            console.log(result);
            setSoldTickets(result);
            setLoadingSold(false);
          })
          .catch((error) => {
            console.log(error);
            dispatch(
              showSnackbar({
                open: true,
                message: "Error loading tickets availability",
                severity: "error",
              })
            );
          });
      }
    };
    fetchData();
  }, [dispatch, open, accounts, event.tokenId]);

  const handleCloseDialog = () => {
    setTicketNumber("");
    closeDialog();
  };

  const handleBuyTicket = async () => {
    if (ticketNumber) {
      const cocoEvents = await getCocoEventsContractInstance();
      setBookingTicket(true);
      cocoEvents.methods
        .buyTicket(event.tokenId, ticketNumber)
        .send({ from: accounts[0], value: event.ticketPrice })
        .then((result) => {
          console.log(result);
          closeDialog();
          setTicketNumber("");
          setBookingTicket(false);
          dispatch(
            showSnackbar({
              open: true,
              message: "Ticket has been booked successfully!",
            })
          );
        })
        .catch(() => {
          setBookingTicket(false);
          dispatch(
            showSnackbar({
              open: true,
              message: "An error occured whie booking the ticket.",
              severity: "error",
            })
          );
        });
    }
  };

  const loadSeatAvailability = () => {
    const tickets = [];
    let chip = <></>;
    for (let i = 0; i < event.ticketSupply; i++) {
      const soldTicket = soldTickets.find(
        (t) => Number(t.ticketNumber) === i + 1
      );
      if (soldTicket) {
        chip = <Chip className="chip" label={i + 1} color="success" />;
      } else {
        chip = (
          <Chip
            className="chip"
            label={i + 1}
            color="success"
            variant={ticketNumber === i + 1 ? "" : "outlined"}
            clickable
            onClick={() => {
              setTicketNumber(i + 1);
            }}
          />
        );
      }
      tickets.push(
        <div className="chip-wrap" key={i}>
          {chip}
        </div>
      );
    }
    return tickets;
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>{event.name}</DialogTitle>
        <DialogContent>
          <TextField
            id="ticket-supply"
            label="Ticket Supply"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            margin="normal"
            disabled
            value={event.ticketSupply}
          />
          <TextField
            id="ticket-price"
            label="Ticket Price"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            margin="normal"
            disabled
            value={event.ticketPrice}
          />
          <p>Tickets Availability</p>
          {loadingSold ? (
            <Box className="flex-center ticket-avail-loading">
              <CircularProgress />
            </Box>
          ) : (
            <div>{loadSeatAvailability()}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Box className="button-box flex-center">
            {!bookingTicket && (
              <Button onClick={handleBuyTicket} disabled={!ticketNumber}>
                Buy
              </Button>
            )}
            {bookingTicket && <CircularProgress size="1.25rem" />}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
