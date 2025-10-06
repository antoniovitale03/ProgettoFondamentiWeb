import Header from "./Header";
import Footer from "./Footer";
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import {Container, Box} from "@mui/material";
import CurrentPopularFilms from "./HomePageFilms/CurrentPopularFilms";
import UpcomingFilms from "./HomePageFilms/UpcomingFilms";
import TopRatedFilms from "./HomePageFilms/TopRatedFilms";
import NowPlayingFilms from "./HomePageFilms/NowPlayingFilms";
import TrendingFilms from "./HomePageFilms/TrendingFilms";
//pannello per utenti non loggati
function DefaultPanel(){
    return(
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight:'100%' }}>
            <Header />
            <Container style={{ flexGrow:1, maxWidth:'90%', marginTop: '50px', marginBottom: '50px' }}>
                <Box>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact/>} />

                        { /* informazioni dei film mostrati nella homePage */}
                        <Route path="/films/current-popular-films" element={<CurrentPopularFilms />} />
                        <Route path="/films/upcoming-films" element={<UpcomingFilms />} />
                        <Route path="/films/top-rated-films" element={<TopRatedFilms />} />
                        <Route path="/films/now-playing-films" element={<NowPlayingFilms />} />
                        <Route path="/films/trending-films" element={<TrendingFilms />} />
                    </Routes>
                </Box>
            </Container>
            <Footer />
        </Box>
    )
}

export default DefaultPanel;