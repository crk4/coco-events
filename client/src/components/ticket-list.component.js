import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { saveTickets } from "../reducers/ticket.reducer";
import getCocoEventsContractInstance from "../utils/getCocoEventsContract";

export const TicketList = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.ticket.tickets);
  const accounts = useSelector((state) => state.account.accounts);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const cocoEvents = await getCocoEventsContractInstance();
      setLoadingTickets(true);
      cocoEvents.methods
        .getMyTickets()
        .call({ from: accounts[0] })
        .then((result) => {
          dispatch(saveTickets(result));
          setLoadingTickets(false);
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
          setLoadingTickets(false);
          setError(true);
        });
    };
    fetchData();
  }, [dispatch, accounts]);

  return (
    <>
      {tickets && tickets.length === 0 && !error && (
        <Alert severity="info">
          No Tickets Found. Please start booking tickets.
        </Alert>
      )}
      {error && (
        <Alert severity="error">
          An error occured while loading my tickets.
        </Alert>
      )}
      {loadingTickets ? (
        <Box className="progress-box flex-center">
          <CircularProgress />
        </Box>
      ) : tickets && tickets.length ? (
        <div className="event-list-wrap">
          <Typography gutterBottom variant="h5">
            My Tickets
          </Typography>
          <Box>
            <Grid sx={{ flexGrow: 1 }} container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {tickets.map((ticket, index) => (
                    <Grid key={index} item>
                      <Card sx={{ minWidth: 345 }}>
                        <CardMedia
                          component="img"
                          alt="coverImage"
                          height="140"
                          image={ticket.parentEvent.coverImage}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {ticket.parentEvent.name}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                            Ticket Number : {ticket.ticketNumber}
                          </Typography>
                        </CardContent>
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
    </>
  );
};
