import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle";
import {Box, Typography, Card, CardMedia, Button} from "@mui/material";
import '../CSS/home.css'
import Carosello from "./Carosello"
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";

function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    const {showNotification} = useNotification()

    const [homePageFilms, setHomePageFilms] = useState({});

    useEffect(() => {
        async function homePageFilmInfo() {
            try{
                const response = await api.get("http://localhost:5001/api/films/get-home-page-film-info");
                let films = await response.data;
                setHomePageFilms(films);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error")
            }
        }
        homePageFilmInfo();
    }, [])

    return (
        <Box>
            <Box>
                {user && <Typography component="h6" >Benvenuto nella home, {user.username}!</Typography>}
                {!user && <h1 id="titolohome1"> Nome del sito</h1>}
                <h2 id="sottotitolo">slogan del sito</h2>
            </Box>
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px">

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


            {homePageFilms?.currentPopularFilms ? <Carosello films={homePageFilms?.currentPopularFilms} title="I film più popolari del momento" link={"/films/current-popular-films"}/> : null}

            {homePageFilms?.upcomingFilms ? <Carosello films={homePageFilms?.upcomingFilms} title="Film in uscita in Italia" link={"/films/upcoming-films"}/> : null}

            {homePageFilms?.topRatedFilms ? <Carosello  films={homePageFilms?.topRatedFilms} title="Film più acclamati dalla critica" link={"/films/top-rated-films"}/> : null}

            {homePageFilms?.nowPlayingFilms ? <Carosello films={homePageFilms?.nowPlayingFilms} title="Film attualmente al cinema" link={"/films/now-playing-films"} /> : null}

            {homePageFilms?.trendingFilms ? <Carosello films={homePageFilms?.trendingFilms} title="Film in tendenza questa settimana" link={"/films/trending-films"}/> : null}

            {homePageFilms?.similarFilms ? <Carosello films={homePageFilms?.similarFilms} title="Film simili a quelli che hai già visto" link={"/films/similarFilms"}/> : null}

        </Box>
    )
}
export default Home;