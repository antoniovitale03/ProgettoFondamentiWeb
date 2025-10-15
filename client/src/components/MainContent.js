import {useAuth} from "../context/authContext";
import {Container} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
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
import ModifyAvatar from "./Settings/ModifyAvatar";
import Archive from "./Archive";
import ActivityPage from "./ActivityPage";
import SearchFilmResults from "./SearchFilmResults";
import FilmPage from "./FilmPage/FilmPage";
import CastPage from "./CastPage";
import CrewPage from "./CrewPage";
import FilmsByYear from "./FilmsByYear";
import ActorPage from "./ActorPage";
import DirectorPage from "./DirectorPage";
import CurrentPopularFilms from "./HomePageFilms/CurrentPopularFilms";
import UpcomingFilms from "./HomePageFilms/UpcomingFilms";
import TopRatedFilms from "./HomePageFilms/TopRatedFilms";
import NowPlayingFilms from "./HomePageFilms/NowPlayingFilms";
import TrendingFilms from "./HomePageFilms/TrendingFilms";
import SimilarFilms from "./FilmPage/SimilarFilms";
import About from "./About";
import Contact from "./Contact";
import Help from "./Help";
//*Il main Content  occupa tutto lo spazio verticale vuoto, spingendo il footer verso il basso.*/}
function MainContent() {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn) {
        return (
            <Container style={{ flexGrow: 1, maxWidth: '90%', marginTop: '50px', marginBottom: 50 }}>
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
                    <Route path="/settings/modify-avatar" element={<ModifyAvatar />} />

                    <Route path="/archive" element={<Archive />} />
                    <Route path="/:username/activity" element={<ActivityPage />} />
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
        )
    }else return(
        <Container style={{ flexGrow: 1, maxWidth:'90%', marginTop: '50px', marginBottom: 50 }}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/archive" element={<Archive />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact/>} />

                    { /* informazioni dei film mostrati nella homePage */}
                    <Route path="/films/current-popular-films" element={<CurrentPopularFilms />} />
                    <Route path="/films/upcoming-films" element={<UpcomingFilms />} />
                    <Route path="/films/top-rated-films" element={<TopRatedFilms />} />
                    <Route path="/films/now-playing-films" element={<NowPlayingFilms />} />
                    <Route path="/films/trending-films" element={<TrendingFilms />} />
                </Routes>
        </Container>
    )
}

export default MainContent;