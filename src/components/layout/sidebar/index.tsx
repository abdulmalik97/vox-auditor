"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import TimelineIcon from "@mui/icons-material/Timeline";
import MedicationIcon from "@mui/icons-material/Medication";
import LogoutIcon from "@mui/icons-material/Logout";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAccount } from "@/contexts/account";
import {
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const router = useRouter();
  const { setAuthUser, setAccount } = useAccount();
  const supabase = createClientComponentClient();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // @ts-expect-error because we know this is the correct type from the context
      setAuthUser(undefined);
      setAccount(undefined);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const tabs = [
    {
      text: "Activity Log",
      href: "/dashboard/activity-log",
      icon: <TimelineIcon />,
    },
    {
      text: "Prescriptions",
      href: "/dashboard/prescription-requests",
      icon: <MedicationIcon />,
    },
    {
      text: "Cancelled Appointments",
      href: "/dashboard/cancelled-appointments",
      icon: <EventBusyIcon />,
    },
    {
      text: "Search Appointments",
      href: "/dashboard/search-appointments",
      icon: <SearchIcon />,
    },
    // {
    //   text: "Schedule Appointment",
    //   href: "/dashboard/pending-requests",
    //   icon: <EventIcon />,
    // },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        mt={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href={"/"}>
          <Image
            src="/assets/logo.png"
            width={75}
            height={75}
            alt="Voxology AI"
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
      </Box>
      <Divider />
      <List>
        {tabs.map((tab) => (
          <ListItem key={tab.text} disablePadding>
            <ListItemButton component={Link} href={tab.href}>
              <ListItemIcon>{tab.icon}</ListItemIcon>
              <ListItemText primary={tab.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: "none" },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          margin: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "white",
          borderRadius: 2,
          border: "0.5px solid #ccc",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
