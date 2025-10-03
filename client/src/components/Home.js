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
    const {user, isLoggedIn} = useAuth();
    const {showNotification} = useNotification()

    const [currentPopularFilms, setCurrentPopularFilms] = useState(null);
    const [upcomingFilms, setUpcomingFilms] = useState(null);
    const [topRatedFilms, setTopRatedFilms] = useState(null);
    const [nowPlayingFilms, setNowPlayingFilms] = useState(null);
    const [trendingFilms, setTrendingFilms] = useState(null);
    const [similarFilms, setSimilarFilms] = useState(null);

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
        <Box>
            <Box>
                {!isLoggedIn ? <p>Utente non loggato</p> : null}
                {user ? <Typography component="h6" >Benvenuto nella home, {user.username}!</Typography>
                : <h1 id="titolohome1"> Nome del sito</h1>
                }
                <h2 id="sottotitolo">slogan del sito</h2>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
            <Card className="card">
                <CardMedia
                component="img"
                width="200px"
                height="30%"
                image="https://zampol.it/wp-content/uploads/2023/02/Caratteristiche_del_gatto-1024x683.jpg"
                alt="esempio"
                />
            </Card>
            </Box>

            {currentPopularFilms && <Carosello films={currentPopularFilms} title="I film più popolari del momento" link={"/films/current-popular-films"}/>}

            {upcomingFilms && <Carosello films={upcomingFilms} title="Film in uscita in Italia" link={"/films/upcoming-films"}/>}

            {topRatedFilms && <Carosello  films={topRatedFilms} title="Film più acclamati dalla critica" link={"/films/top-rated-films"}/> }

            {nowPlayingFilms && <Carosello films={nowPlayingFilms} title="Film attualmente al cinema" link={"/films/now-playing-films"} /> }

            {trendingFilms && <Carosello films={trendingFilms} title="Film in tendenza questa settimana" link={"/films/trending-films"}/>}

            {similarFilms && <Carosello films={similarFilms} title="Film simili a quelli che hai già visto" link={""}/>}

        </Box>
    )
}
export default Home;