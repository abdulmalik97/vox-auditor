import Sidebar from "./sidebar";

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
