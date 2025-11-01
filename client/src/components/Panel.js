import Header from "./Header";
import Footer from "./Footer";
import {Box} from "@mui/material";
import MainContent from "./MainContent";
//la componente principale che gestisce tutti i percorsi
export default function Panel() {
  return (
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Header />
          <MainContent />
          <Footer />
      </Box>
  );
}
