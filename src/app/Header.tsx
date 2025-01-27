"use client";

import { AppBar, Toolbar, Button, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAccount } from "@/contexts/account/ hooks";
import Image from "next/image";

interface HeaderProps {
  isAuthed: boolean;
}

export default function Header(props: HeaderProps) {
  const router = useRouter();
  const { setAuthUser, setAccount } = useAccount();

  // If you're using @supabase/auth-helpers-nextjs, this is the recommended client factory:
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // @ts-expect-error because
      setAuthUser(undefined);
      setAccount(undefined)
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
      <Toolbar
        sx={{
          justifyContent: props.isAuthed ? "flex-end" : "flex-start",
          py: "0.87%",
        }}
      >
        {!props.isAuthed ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Aligns the content to the left
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
        ) : null}

        {props.isAuthed ? (
          <Button
            color="primary"
            onClick={handleLogout}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            Logout
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
