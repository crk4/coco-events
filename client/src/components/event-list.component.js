import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import BuyTicketDialog from "./buy-ticket-dialog.component";
import getCocoEventsContractInstance from "../utils/getCocoEventsContract";
import { saveEvents } from "../reducers/event.reducer";

export const EventList = (props) => {
  const dispatch = useDispatch();
  const { type } = props;
  const accounts = useSelector((state) => state.account.accounts);
  const events = useSelector((state) => {
    const events = state.event.events;
    if (type === "all") {
      return events;
    } else {
      return events && events.filter((e) => e.owner === accounts[0]);
    }
  });
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [currentEvent, setCurrentEvent] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const cocoEvents = await getCocoEventsContractInstance();
      setLoadingEvents(true);
      cocoEvents.methods
        .getAllEvents()
        .call({ from: accounts[0] })
        .then((result) => {
          dispatch(saveEvents(result));
          setLoadingEvents(false);
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
          setLoadingEvents(false);
          setError(true);
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
      {events && events.length === 0 && !error && (
        <Alert severity="info">
          No Events Found. Please start creating events.
        </Alert>
      )}
      {error && (
        <Alert severity="error">An error occured while loading events.</Alert>
      )}
      {loadingEvents ? (
        <Box className="progress-box flex-center">
          <CircularProgress />
        </Box>
      ) : events && events.length ? (
        <div className="event-list-wrap">
          <Typography gutterBottom variant="h5">
            {type === "all" ? "All Events" : "My Events"}
          </Typography>
          <Box>
            <Grid sx={{ flexGrow: 1 }} container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {events.map((event, index) => (
                    <Grid key={index} item>
                      <Card sx={{ minWidth: 345 }}>
                        <CardMedia
                          component="img"
                          alt="coverImage"
                          height="140"
                          image={event.coverImage}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
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
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        ""
      )}
      {events && events.length ? (
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
