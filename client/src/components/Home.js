import {useAuth} from "../context/authContext"
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Typography} from "@mui/material";
import '../CSS/home.css'
import Carosello from "./Carosello"
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";

function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    const {showNotification} = useNotification()

    const [films, setFilms] = useState(null);

    useEffect(() => {
        const homePageFilmInfo = async () => {
            try{
                const param = new URLSearchParams();
                if(user) param.append("userID", user.id)
                const response = await api.get(`http://localhost:5001/api/films/home/get-home-page-films?${param.toString()}`);
                let films = await response.data;
                setFilms(films);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error")
            }
        }
        homePageFilmInfo();
    }, [user, showNotification])

    return (
        <Box>
            <Box>
                {user ? <Typography component="h6" >Benvenuto nella home, {user.username}!</Typography>
                : <h1 id="titolohome1"> Nome del sito</h1>
                }
                <h2 id="sottotitolo">slogan del sito</h2>
            </Box>

            {
                films &&
                <Box>
                <Carosello films={films.currentPopularFilms} title="I film più popolari del momento" link={"/films/current-popular-films"}/>
                <Carosello films={films.upcomingFilms} title="Film in uscita in Italia" link={"/films/upcoming-films"}/>
                <Carosello  films={films.topRatedFilms} title="Film più acclamati dalla critica" link={"/films/top-rated-films"}/>
                <Carosello films={films.nowPlayingFilms} title="Film attualmente al cinema" link={"/films/now-playing-films"} />
                <Carosello films={films.trendingFilms} title="Film in tendenza questa settimana" link={"/films/trending-films"}/>
                { films.similarFilms && <Carosello films={films.similarFilms} title="Film simili a quelli che hai già visto" />}
                </Box>
        }
        </Box>
    )
}
export default Home;