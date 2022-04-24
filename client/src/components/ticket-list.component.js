import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/event-list.styles.css";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { saveTickets } from "../reducers/ticket.reducer";
import getAccounts from "../utils/getAccounts";
import getCocoEventsContractInstance from "../utils/getCocoEventsContract";

export const TicketList = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.ticket.tickets);

  useEffect(() => {
    const fetchData = async () => {
      const accounts = await getAccounts();
      const cocoEvents = await getCocoEventsContractInstance();
      cocoEvents.methods
        .getMyTickets()
        .call({ from: accounts[0] })
        .then((result) => {
          dispatch(saveTickets(result));
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, [dispatch]);

  return (
    <>
      {tickets.length === 0 && (
        <Alert severity="info">
          No Tickets Found. Please start booking events.
        </Alert>
      )}
      <div className="event-list-wrap">
        <Typography gutterBottom variant="h5">
          My Tickets
        </Typography>
        <Box>
          <Grid sx={{ flexGrow: 1 }} container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {tickets.length
                  ? tickets.map((ticket, index) => (
                      <Grid key={index} item>
                        <Card sx={{ minWidth: 345 }}>
                          <CardMedia
                            component="img"
                            alt="coverImage"
                            height="140"
                            image={ticket.parentEvent.coverImage}
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {ticket.parentEvent.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                              Ticket Number : {ticket.ticketNumber}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  : ""}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};
