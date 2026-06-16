"use client";
import Sidebar from "./sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  );
};

export default Layout;
