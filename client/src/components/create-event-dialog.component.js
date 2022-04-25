import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import getCocoEventsContractInstance from "../utils/getCocoEventsContract";
import { updateEvent } from "../reducers/event.reducer";
import { showSnackbar } from "../reducers/snackbar.reducer";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function CreateEventDialog(props) {
  const dispatch = useDispatch();
  const { open, closeDialog } = props;
  const accounts = useSelector((state) => state.account.accounts);
  const [creatingEvent, setCreatingEvent] = React.useState(false);

  const formInitialValues = {
    name: "",
    description: "",
    coverImage: "",
    ticketSupply: "",
    ticketPrice: "",
  };
  const initialErrorState = {
    name: { text: "Name", errorMessage: "", error: false },
    description: { text: "Description", errorMessage: "", error: false },
    coverImage: { text: "Cover Image", errorMessage: "", error: false },
    ticketSupply: { text: "Ticket Supply", errorMessage: "", error: false },
    ticketPrice: { text: "Ticket Price", errorMessage: "", error: false },
  };
  const [event, setEvent] = React.useState(formInitialValues);
  const [errors, setErrors] = React.useState(initialErrorState);

  const handleInputChange = (e, field) => {
    event[field] = e.target.value;
    setEvent({ ...event });
  };

  const handleInputBlur = (field) => {
    if (!event[field]) {
      setErrorMessage(field, true);
    } else {
      setErrorMessage(field, false);
    }
  };

  const setErrorMessage = (field, error) => {
    errors[field].error = error;
    if (error) {
      errors[field].errorMessage = errors[field].text + " is required";
    } else {
      errors[field].errorMessage = "";
    }
    setErrors({ ...errors });
  };

  const validate = () => {
    let isValid = true;
    for (var key in formInitialValues) {
      if (!event[key]) {
        setErrorMessage(key, true);
        isValid = false;
      } else {
        setErrorMessage(key, false);
      }
    }
    return isValid;
  };

  const handleCreateEvent = async () => {
    const isValid = validate();
    if (isValid) {
      const cocoEvents = await getCocoEventsContractInstance();
      event.tokenId = 0;
      event.owner = accounts[0];
      setCreatingEvent(true);
      cocoEvents.methods
        .createEvent(event)
        .send({ from: accounts[0] })
        .then((result) => {
          console.log(result);
          event.tokenId = result.events.EventCreated.returnValues._eventId;
          dispatch(updateEvent({ ...event }));
          closeDialog();
          setEvent(formInitialValues);
          setCreatingEvent(false);
          dispatch(
            showSnackbar({
              open: true,
              message: "Event has been created successfully!",
            })
          );
        })
        .catch((error) => {
          console.log(error);
          setCreatingEvent(false);
          dispatch(
            showSnackbar({
              open: true,
              message: "An error occured whie creating the event",
              severity: "error",
            })
          );
        });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            margin="normal"
            onChange={(e) => {
              handleInputChange(e, "name");
            }}
            onBlur={(e) => handleInputBlur("name", "Name")}
            value={event.name}
            helperText={errors.name.errorMessage}
            error={errors.name.error}
          />
          <TextField
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            margin="normal"
            onChange={(e) => {
              handleInputChange(e, "description");
            }}
            onBlur={(e) => handleInputBlur("description")}
            value={event.description}
            helperText={errors.description.errorMessage}
            error={errors.description.error}
          />
          <TextField
            id="cover-image"
            label="Cover Image"
            type="text"
            fullWidth
            variant="standard"
            margin="normal"
            onChange={(e) => {
              handleInputChange(e, "coverImage");
            }}
            onBlur={(e) => handleInputBlur("coverImage")}
            value={event.coverImage}
            helperText={errors.coverImage.errorMessage}
            error={errors.coverImage.error}
          />
          <TextField
            id="ticket-supply"
            label="Ticket Supply"
            type="number"
            min="0"
            fullWidth
            variant="standard"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            margin="normal"
            onChange={(e) => {
              handleInputChange(e, "ticketSupply");
            }}
            onBlur={(e) => handleInputBlur("ticketSupply")}
            value={event.ticketSupply}
            helperText={errors.ticketSupply.errorMessage}
            error={errors.ticketSupply.error}
          />
          <TextField
            id="ticket-price"
            label="Ticket Price"
            type="number"
            min="0"
            fullWidth
            variant="standard"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            margin="normal"
            onChange={(e) => {
              handleInputChange(e, "ticketPrice");
            }}
            onBlur={(e) => handleInputBlur("ticketPrice")}
            value={event.ticketPrice}
            helperText={errors.ticketPrice.errorMessage}
            error={errors.ticketPrice.error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Box className="button-box flex-center">
            {!creatingEvent && (
              <Button onClick={handleCreateEvent}>Create</Button>
            )}
            {creatingEvent && <CircularProgress size="1.25rem" />}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
