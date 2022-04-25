import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Web3Singleton from "./utils/getWeb3";
import Layout from "./components/layout.component";
import "./App.css";
import { EventList } from "./components/event-list.component";
import { TicketList } from "./components/ticket-list.component";
import { saveAccounts } from "./reducers/account.reducer";
import getAccounts from "./utils/getAccounts";

const App = () => {
  const dispatch = useDispatch();
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const web3 = await Web3Singleton.getInstance();
        const accounts = await getAccounts();
        if (accounts.length) {
          dispatch(saveAccounts(accounts));
        } else {
          setError(true);
        }
        if (web3) {
          setWeb3(web3);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!web3) {
    return (
      <Box className="progress-box flex-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="progress-box flex-center">
        <Alert severity="error">Error loading Web3</Alert>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/all-events" />} />
        <Route element={<Layout />}>
          <Route path="/all-events" element={<EventList type="all" />} />
          <Route path="/my-events" element={<EventList type="my" />} />
          <Route path="/my-tickets" element={<TicketList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
