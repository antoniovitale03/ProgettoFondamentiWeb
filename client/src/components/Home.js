import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle";
import {Box, Typography, Card, CardMedia} from "@mui/material";
import '../CSS/home.css'
import Carosello from "./Carosello"
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";

function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    const {showNotification} = useNotification()

    const [currentPopularFilms, setCurrentPopularFilms] = useState({});
    const [upcomingFilms, setUpcomingFilms] = useState({});
    const [topRatedFilms, setTopRatedFilms] = useState({});
    const [nowPlayingFilms, setNowPlayingFilms] = useState({});
    const [trendingFilms, setTrendingFilms] = useState({});
    const [similarFilms, setSimilarFilms] = useState({});

    useEffect(() => {
        async function homePageFilmInfo() {
            try{
                const response = await api.get("http://localhost:5001/api/films/home/get-home-page-film-info");
                let films = await response.data;
                setCurrentPopularFilms(films.currentPopularFilms);
                setUpcomingFilms(films.upcomingFilms);
                setTopRatedFilms(films.topRatedFilms);
                setNowPlayingFilms(films.nowPlayingFilms);
                setTrendingFilms(films.trendingFilms);
                setSimilarFilms(films.similarFilms);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error")
            }
        }
        homePageFilmInfo();
    }, [])

    return (
    <>
        <Box>
            <Box>
                <h1 id="titolo1">Nome del sito</h1>
                <h2 id="sottotitolo">slogan del sito</h2>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px'}}>
            <Card sx={{borderRadius:"60px"}} className="card">
                <CardMedia
                component="img"
                image="http://i.imgur.com/Abm0wRq.jpg"
                />
            </Card>
            </Box>

            {currentPopularFilms.length > 0 ? <Carosello films={currentPopularFilms} title="I film più popolari del momento 🎟️" link={"/films/current-popular-films"}/> : null}

            {upcomingFilms.length > 0 ? <Carosello films={upcomingFilms} title="Film in uscita in Italia 🍕" link={"/films/upcoming-films"}/> : null}

            {topRatedFilms.length > 0 ? <Carosello  films={topRatedFilms} title="Film più acclamati dalla critica 🌟" link={"/films/top-rated-films"}/> : null}

            {nowPlayingFilms.length > 0 ? <Carosello films={nowPlayingFilms} title="Film attualmente al cinema 🍿" link={"/films/now-playing-films"} /> : null}

            {trendingFilms.length > 0 ? <Carosello films={trendingFilms} title="Film in tendenza questa settimana 🔥" link={"/films/trending-films"}/> : null}

            {similarFilms.length > 0 ? <Carosello films={similarFilms} title="Film simili a quelli che hai già visto ↪️" link={""}/> : null}

        </Box>
        </>
    )
}
export default Home;