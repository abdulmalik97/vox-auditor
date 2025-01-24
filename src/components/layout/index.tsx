"use client"
import { useAccount } from "@/contexts/account";
import Sidebar from "./sidebar";
import React, { useEffect } from "react";
import { AuthUser } from "@supabase/supabase-js";

interface LayoutProps {
  authUser: AuthUser | null;
  children: React.ReactNode;
}

const Layout = ({ children, authUser }: LayoutProps) => {
  const { setAuthUser } = useAccount();

  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        setAuthUser(authUser);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  );
};

export default Layout;
