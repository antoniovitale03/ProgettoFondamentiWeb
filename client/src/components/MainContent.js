import {Container} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Home from "./HomePage/Home";
import Profile from "./Profile";
import Followers from "./Followers";
import Following from "./Following";
import Watched from "./Watched";
import FavoritesFilms from "./FavoritesFilms";
import Reviews from "./Reviews";
import Watchlist from "./Watchlist";
import Lists from "./Lists";
import List from "./List";
import ModifyProfile from "./Settings/ModifyProfile";
import ModifyPassword from "./Settings/ModifyPassword";
import DeleteAccount from "./Settings/DeleteAccount";
import Archive from "./Archive";
import ActivityPage from "./ActivityPage";
import SearchFilmResults from "./SearchFilmResults";
import FilmPage from "./FilmPage/FilmPage";
import Cast from "./Cast";
import Crew from "./Crew";
import FilmsByYear from "./FilmsByYear";
import Actor from "./Actor";
import Director from "./Director";
import CurrentPopularFilms from "./HomePage/CurrentPopularFilms";
import UpcomingFilms from "./HomePage/UpcomingFilms";
import TopRatedFilms from "./HomePage/TopRatedFilms";
import NowPlayingFilms from "./HomePage/NowPlayingFilms";
import TrendingFilms from "./HomePage/TrendingFilms";
import SimilarFilms from "./FilmPage/SimilarFilms";
import About from "./About";
import Contact from "./Contact";
import Help from "./Help";
//*Il main Content occupa tutto lo spazio verticale vuoto, spingendo il footer verso il basso.*/}
export default function MainContent() {
    return (
            <Container style={{ flexGrow: 1, maxWidth: '90vw', marginTop: '7vw', marginBottom: '5vw' }}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/:username/profile" element={<Profile />} />
                    <Route path="/:username/followers" element={<Followers />} />
                    <Route path="/:username/following" element={ <Following /> } />

                    <Route path="/:username/watched" element={<Watched />} />
                    <Route path="/:username/favorites" element={<FavoritesFilms />} />
                    <Route path="/:username/reviews" element={<Reviews />} />
                    <Route path="/:username/watchlist" element={<Watchlist />} />
                    <Route path="/:username/lists" element={<Lists />  }/>
                    <Route path="/:username/:listName/list" element={<List />} />

                    <Route path="/settings/modify-profile" element={ <ModifyProfile />} />
                    <Route path="/settings/modify-password" element={ <ModifyPassword />} />
                    <Route path="/settings/delete-account" element={<DeleteAccount />} />

                    <Route path="/archive" element={<Archive />} />
                    <Route path="/:username/activity" element={<ActivityPage />} />
                    <Route path="/search/:filmTitle" element={<SearchFilmResults />} />
                    <Route path="/film/:filmTitle/:filmID" element={<FilmPage />} />

                    <Route path="/film/:filmTitle/:filmID/cast" element={<Cast />} />
                    <Route path="/film/:filmTitle/:filmID/crew" element={<Crew />} />
                    <Route path="/films/:year" element={<FilmsByYear />} />
                    <Route path="/actor/:actorName/:actorID" element={<Actor />} />
                    <Route path="/director/:directorName/:directorID" element={ <Director />} />

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
        )
}