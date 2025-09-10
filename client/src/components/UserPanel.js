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
import Archivio from "./Archivio";
import Recensioni from "./Recensioni";
import Watchlist from "./Watchlist";
import SearchFilmResults from "./SearchFilmResults";
import FilmPage from "./FilmPage";
import FavoritesFilms from "./FavoritesFilms";
import Log from "./Log";
import CastPage from "./CastPage";
import CrewPage from "./CrewPage";
import ActorPage from "./ActorPage";
import DirectorPage from "./DirectorPage";
import ModifyProfile from "./ModifyProfile";
import {Container, Box} from "@mui/material";
import ModifyPassword from "./ModifyPassword";
import ModifyAvatar from "./ModifyAvatar";
import FilmsByYear from "./FilmsByYear";
//la componente principale che gestisce tutti i percorsi
function UserPanel() {

    let paths = ["/", "/profile", "/lista-film", "/favorites", "/recensioni", "/watchlist",
                 "/settings/modify-profile", "/settings/modify-password", "/settings/delete-account",
                 "/settings/modify-avatar", "/archivio", "/search/:filmTitle", "/film/:filmTitle/:filmID",
                 "/log-a-film", "/film/:filmTitle/cast", "film/:filmTitle/crew", "/actor/:actorName/:actorID",
                 "/director/:directorName/:directorID", "/about", "/contact", "/help"]

    let components = [ <Home />, <Profile/>, <ListaFilm />, <FavoritesFilms/>, <Recensioni/>, <Watchlist/>, <ModifyProfile/>,
                     <ModifyPassword/>, <DeleteAccount/>, <ModifyAvatar/>, <Archivio/>, <SearchFilmResults />, <FilmPage />, <Log/>,
                     <CastPage/>, <CrewPage/>, <ActorPage/>, <DirectorPage/>, <About/>, <Contact />, <Help/>]
  return (
      <Box style={{ display: 'flex', flexDirection: 'column', minHeight:'100%' }}>
          <Header />
          {/*Questa dice all'area main di crescere e occupare tutto lo spazio verticale vuoto, spingendo il footer verso il basso.*/}
          <Container style={{flexGrow: 1, maxWidth: '90%'}}>
                  <Routes>
                      <Route path="/" element={<Home/>} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/lista-film" element={<ListaFilm />} />
                      <Route path="/favorites" element={<FavoritesFilms />} />
                      <Route path="/recensioni" element={<Recensioni />} />
                      <Route path="/watchlist" element={<Watchlist />} />

                      <Route path="/settings/modify-profile" element={ <ModifyProfile />} />
                      <Route path="/settings/modify-password" element={ <ModifyPassword />} />
                      <Route path="/settings/delete-account" element={<DeleteAccount />} />
                      <Route path="/settings/modify-avatar" element={<ModifyAvatar />} />

                      <Route path="/archivio" element={<Archivio />} />
                      <Route path="/search/:filmTitle" element={<SearchFilmResults />} />
                      <Route path="/film/:filmTitle/:filmID" element={<FilmPage />} />
                      <Route path="/log-a-film" element={<Log />} />

                      <Route path="/film/:filmTitle/cast" element={<CastPage />} />
                      <Route path="/film/:filmTitle/crew" element={<CrewPage />} />
                      <Route path="/films/:year/page/:page" element={<FilmsByYear />} />
                      <Route path="/actor/:actorName/:actorID" element={<ActorPage />} />
                      <Route path="/director/:directorName/:directorID" element={ <DirectorPage />} />

                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<Help />} />
                  </Routes>
          </Container>
          <Footer />
      </Box>
  );
}

export default UserPanel;
