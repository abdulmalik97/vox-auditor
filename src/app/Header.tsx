"use client";

import { AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAccount } from "@/contexts/account/ hooks";

export default function Header() {
  const router = useRouter();
  const { setAuthUser } = useAccount();

  // If you're using @supabase/auth-helpers-nextjs, this is the recommended client factory:
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // @ts-expect-error because
      setAuthUser();
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
      <Toolbar sx={{ justifyContent: "flex-end", py: 1 }}>
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
      </Toolbar>
    </AppBar>
  );
}
