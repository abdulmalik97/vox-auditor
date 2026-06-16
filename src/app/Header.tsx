"use client";

import { AppBar, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "background.paper",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
      color="inherit"
    >
      <Toolbar>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Link href="/">
            <Image
              src="/assets/logo.png"
              width={100}
              height={20}
              alt="Logo"
            />
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
}
