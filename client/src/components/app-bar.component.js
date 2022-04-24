import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CreateEventDialog from "./create-event-dialog.component";
import "../styles/app-bar.styles.css";

export default function COCOAppBar() {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleCreateEvent = () => {
    setOpenDialog(true);
  };

  const handleCloseDoalog = () => {
    setOpenDialog(false);
  };

  const toggleDrawer = (open) => {
    setOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: "auto" }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        <ListItem button selected={location.pathname === "/all-events"}>
          <Button
            className="link-button"
            component={RouterLink}
            to="/all-events"
            disableRipple
          >
            All Events
          </Button>
        </ListItem>
        <ListItem button selected={location.pathname === "/my-events"}>
          <Button
            className="link-button"
            component={RouterLink}
            to="/my-events"
            disableRipple
          >
            My Events
          </Button>
        </ListItem>
        <ListItem button selected={location.pathname === "/my-tickets"}>
          <Button
            className="link-button"
            component={RouterLink}
            to="/my-tickets"
            disableRipple
          >
            My Tickets
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  const handleMenuClick = () => {
    toggleDrawer(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              COCO Events
            </Typography>
            <Button color="inherit" onClick={handleCreateEvent}>
              Create Event
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <CreateEventDialog open={openDialog} closeDialog={handleCloseDoalog} />
      <Drawer
        anchor="left"
        open={open}
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        {list()}
      </Drawer>
    </>
  );
}
