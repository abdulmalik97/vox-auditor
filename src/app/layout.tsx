"use client";

import { AccountProvider, useAccount } from "@/contexts/account";
import theme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./Header";

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
      {/* Only render Header if user is logged in */}
      <Header isAuthed={currentAccount !== undefined} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
