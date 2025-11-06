import Header from "./Header/Header";
import Footer from "./Footer";
import {Box} from "@mui/material";
import MainContent from "./MainContent";

export default function Layout() {
  return (
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Header />
          <MainContent />
          <Footer />
      </Box>
  );
}
