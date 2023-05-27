import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { GlobalContext } from "./GlobalContext";

function AppBarLabel(label) {
  const { account } = useContext(GlobalContext);
  console.log("account in AppBar: ", account);
  return (
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        {/* <MenuIcon /> */}
        {account ? `${account.slice(0, 6)}...${account.slice(37, 42)}` : null}
      </IconButton>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        {label}
      </Typography>
    </Toolbar>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2"
    }
  }
});

export default function DarkAppBar() {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        {/* <AppBar position="static" color="primary" enableColorOnDark>
          {AppBarLabel("enableColorOnDark")}
        </AppBar> */}
        <AppBar position="static" color="primary">
          {AppBarLabel("ChainBlock NFT")}
        </AppBar>
      </ThemeProvider>
    </Stack>
  );
}
