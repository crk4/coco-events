import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "../styles/event-list.styles.css";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import BuyTicketDialog from "./buy-ticket-dialog.component";
import getAccounts from "../utils/getAccounts";
import getCocoEventsContractInstance from "../utils/getCocoEventsContract";
import { saveEvents } from "../reducers/event.reducer";
import { showSnackbar } from "../reducers/snackbar.reducer";

export const EventList = (props) => {
  const dispatch = useDispatch();
  const { type } = props;
  const [accounts, setAccounts] = useState([]);
  const events = useSelector((state) => {
    if (type === "all") {
      return state.event.events;
    } else {
      return state.event.events.filter((e) => e.owner === accounts[0]);
    }
  });
  const [currentEvent, setCurrentEvent] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setAccounts(await getAccounts());
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const cocoEvents = await getCocoEventsContractInstance();
      cocoEvents.methods
        .getAllEvents()
        .call({ from: accounts[0] })
        .then((result) => {
          dispatch(saveEvents(result));
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
          dispatch(
            showSnackbar({
              open: true,
              message: "Error loading events",
              severity: "error",
            })
          );
        });
    };
    fetchData();
  }, [dispatch, accounts]);

  const openTicketDialog = (event) => {
    setCurrentEvent(event);
    setOpenDialog(true);
  };
  const closeDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      {events.length === 0 && (
        <Alert severity="info">
          No Events Found. Please start creating events.
        </Alert>
      )}
      <div className="event-list-wrap">
        <Typography gutterBottom variant="h5">
          {type === "all" ? "All Events" : "My Events"}
        </Typography>
        <Box>
          <Grid sx={{ flexGrow: 1 }} container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {events.length
                  ? events.map((event, index) => (
                      <Grid key={index} item>
                        <Card sx={{ minWidth: 345 }}>
                          <CardMedia
                            component="img"
                            alt="coverImage"
                            height="140"
                            image={event.coverImage}
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {event.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                            >
                              {event.description}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              onClick={() => openTicketDialog(event)}
                            >
                              Tickets
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  : ""}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      {events.length ? (
        <BuyTicketDialog
          event={currentEvent}
          open={openDialog}
          closeDialog={closeDialog}
        />
      ) : (
        ""
      )}
    </>
  );
};
