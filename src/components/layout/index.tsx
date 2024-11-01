import { Box, Container, Stack } from "@mui/material";
import Navbar from "./navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Container maxWidth={false} disableGutters>
      <Navbar />
        {children}
      </Container>
    </>
  );
};

export default Layout;
