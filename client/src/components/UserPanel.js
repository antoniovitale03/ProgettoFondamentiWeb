import {Routes, Route } from 'react-router-dom';
import Profile from "./Profile";
import Home from "./Home";
import About from "./About";
import DeleteAccount from "./DeleteAccount";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import Help from "./Help";
import ListaFilm from "./ListaFilm";
import Settings from "./Settings";
import Archivio from "./Archivio";
import "../CSS/UserPanel.css";
import Recensioni from "./Recensioni";
import Watchlist from "./Watchlist";
import SearchFilmResults from "./SearchFilmResults";
import Film from "./Film";
import Log from "./Log";
import {Container, Box} from "@mui/material";
//la componente principale che gestisce tutti i percorsi
function UserPanel() {
  return (
      <div className="mainLayout">
          <Header />
          <Container className="content-page">
              <Box>
                  <Routes>
                      <Route path="/" element={<Home/>} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/lista-film" element={<ListaFilm />} />
                      <Route path="/recensioni" element={<Recensioni />} />
                      <Route path="/watchlist" element={<Watchlist />} />
                      <Route path="/settings" element={<Settings />} />

                      <Route path="/archivio" element={<Archivio />} />
                      <Route path="/search/:film" element={<SearchFilmResults />} />
                      <Route path="/film/:film" element={<Film />} />
                      <Route path="/log-a-film" element={<Log />} />

                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/delete-account" element={<DeleteAccount />} />
                      <Route path="/help" element={<Help />} />
                  </Routes>
              </Box>
          </Container>
          <Footer />
      </div>
  );
}

export default UserPanel;
