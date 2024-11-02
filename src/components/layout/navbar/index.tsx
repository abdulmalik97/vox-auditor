import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { Link, Typography } from "@mui/material";
import Image from "next/image";

const Navbar = () => {
  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box>
            <Link href={"/"}>
              <Image
                src="/assets/logo.png"
                width={125}
                height={95}
                alt="Logo"
              />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box p={2}>
              <Link href={"/activity-log"} color="inherit">
                <Typography>Activity Log</Typography>
              </Link>
            </Box>
            <Box p={2}>
              <Link href={"/patients"} color="inherit">
                <Typography>Patients</Typography>
              </Link>
            </Box>
            <Box p={2}>
              <Link href={"/appointments"} color="inherit">
                <Typography>Appointments</Typography>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
