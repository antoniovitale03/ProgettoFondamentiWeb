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
      <Box style={{display: 'flex', flexDirection: 'column', minHeight:'100%' }}>
          <Header />
          {/*Questa dice all'area main di crescere e occupare tutto lo spazio verticale vuoto, spingendo il footer verso il basso.*/}
          <Container style={{flexGrow: 1}}>
              <Box>
                  <Routes>
                      { paths.map((path, index) => <Route path={path} key={index} element={components[index]}/>) }
                  </Routes>
              </Box>
          </Container>
          <Footer />
      </Box>
  );
}

export default UserPanel;
