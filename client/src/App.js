import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Web3Singleton from "./utils/getWeb3";
import Layout from "./components/layout.component";
import "./App.css";
import { EventList } from "./components/event-list.component";
import { TicketList } from "./components/ticket-list.component";

const App = () => {
  const [web3, setWeb3] = useState(null);
  useEffect(async () => {
    try {
      const web3 = await Web3Singleton.getInstance();
      setWeb3(web3);
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`);
      console.error(error);
    }
  }, []);

  if (!web3) {
    return (
      <Box className="progress-box">
        <CircularProgress />
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
