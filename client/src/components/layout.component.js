import React from "react";
import { Outlet } from "react-router-dom";
import AppBar from "./app-bar.component";
import CustomSnackbar from "./snackbar.component";

export default function Layout() {
  return (
    <>
      <AppBar />
      <Outlet />
      <CustomSnackbar />
    </>
  );
}
