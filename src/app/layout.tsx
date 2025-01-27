"use client";

import { AccountProvider, useAccount } from "@/contexts/account";
import theme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AccountProvider>
              <MainLayout>{children}</MainLayout>
            </AccountProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentAccount } = useAccount();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Logo section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Link href="/">
          <Image src="/assets/logo.png" width={250} height={60} alt="Logo" />
        </Link>
      </div>

      {/* Only render Header if user is logged in */}
      {currentAccount && <Header />}
      <main
        style={{
          flex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}
