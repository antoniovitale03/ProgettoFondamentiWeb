import {Routes, Route } from 'react-router-dom';
import Profile from "./Profile";
import Home from "./Home";
import About from "./About";
import DeleteAccount from "./Settings/DeleteAccount";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import Help from "./Help";
import WatchedFilms from "./WatchedFilms";
import Archivio from "./Archivio";
import Recensioni from "./Recensioni";
import Watchlist from "./Watchlist";
import SearchFilmResults from "./SearchFilmResults";
import FilmPage from "./FilmPage/FilmPage";
import FavoritesFilms from "./FavoritesFilms";
import CastPage from "./CastPage";
import CrewPage from "./CrewPage";
import ActorPage from "./ActorPage";
import DirectorPage from "./DirectorPage";
import ModifyProfile from "./Settings/ModifyProfile";
import {Container, Box} from "@mui/material";
import ModifyPassword from "./Settings/ModifyPassword";
import ModifyAvatar from "./Settings/ModifyAvatar";
import FilmsByYear from "./FilmsByYear";
import CurrentPopularFilms from "./HomePageFilms/CurrentPopularFilms";
import UpcomingFilms from "./HomePageFilms/UpcomingFilms";
import TopRatedFilms from "./HomePageFilms/TopRatedFilms";
import NowPlayingFilms from "./HomePageFilms/NowPlayingFilms";
import TrendingFilms from "./HomePageFilms/TrendingFilms";
import SimilarFilms from "./FilmPage/SimilarFilms";
import Activity from "./Activity";
//la componente principale che gestisce tutti i percorsi
function UserPanel() {
    // let paths = ["/", "/profile", "/lista-film", "/favorites", "/recensioni", "/watchlist",
    //                  "/settings/modify-profile", "/settings/modify-password", "/settings/delete-account",
    //                  "/settings/modify-avatar", "/archivio", "/search/:filmTitle", "/film/:filmTitle/:filmID",
    //                  "/log-a-film", "/film/:filmTitle/cast", "film/:filmTitle/crew", "/actor/:actorName/:actorID",
    //                  "/director/:directorName/:directorID", "/about", "/contact", "/help"]
    //
    //     let components = [ <Home />, <Profile/>, <WatchedFilms />, <FavoritesFilms/>, <Recensioni/>, <Watchlist/>, <ModifyProfile/>,
    //                      <ModifyPassword/>, <DeleteAccount/>, <ModifyAvatar/>, <Archivio/>, <SearchFilmResults />, <FilmPage />, <Log/>,
    //                      <CastPage/>, <CrewPage/>, <ActorPage/>, <DirectorPage/>, <About/>, <Contact />, <Help/>]

  return (
      <Box style={{ display: 'flex', flexDirection: 'column', height:'100%' }}>
          <Header />
          {/*Questa dice all'area main di crescere e occupare tutto lo spazio verticale vuoto, spingendo il footer verso il basso.*/}
          <Container style={{ flexGrow: 1, maxWidth: '90%', marginTop: '50px', marginBottom: '50px' }}>
                  <Routes>
                      <Route path="/" element={<Home/>} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/watched" element={<WatchedFilms />} />
                      <Route path="/favorites" element={<FavoritesFilms />} />
                      <Route path="/recensioni" element={<Recensioni />} />
                      <Route path="/watchlist" element={<Watchlist />} />

                      <Route path="/settings/modify-profile" element={ <ModifyProfile />} />
                      <Route path="/settings/modify-password" element={ <ModifyPassword />} />
                      <Route path="/settings/delete-account" element={<DeleteAccount />} />
                      <Route path="/settings/modify-avatar" element={<ModifyAvatar />} />

                      <Route path="/archivio" element={<Archivio />} />
                      <Route path="/activity" element={<Activity />} />
                      <Route path="/search/:filmTitle" element={<SearchFilmResults />} />
                      <Route path="/film/:filmTitle/:filmID" element={<FilmPage />} />

                      <Route path="/film/:filmTitle/:filmID/cast" element={<CastPage />} />
                      <Route path="/film/:filmTitle/:filmID/crew" element={<CrewPage />} />
                      <Route path="/films/:year" element={<FilmsByYear />} />
                      <Route path="/actor/:actorName/:actorID" element={<ActorPage />} />
                      <Route path="/director/:directorName/:directorID" element={ <DirectorPage />} />

                      { /* informazioni dei film mostrati nella homePage */}
                      <Route path="/films/current-popular-films" element={<CurrentPopularFilms />} />
                      <Route path="/films/upcoming-films" element={<UpcomingFilms />} />
                      <Route path="/films/top-rated-films" element={<TopRatedFilms />} />
                      <Route path="/films/now-playing-films" element={<NowPlayingFilms />} />
                      <Route path="/films/trending-films" element={<TrendingFilms />} />

                      <Route path="/film/:filmTitle/:filmID/similar" element={<SimilarFilms />} />

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
