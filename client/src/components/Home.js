import {useAuth} from "../context/authContext"
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Card, CardMedia} from "@mui/material";
import '../CSS/home.css'
import Carosello from "./Carosello"
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";

export default function Home(){
    useDocumentTitle("Home")
    const {user} = useAuth();
    const {showNotification} = useNotification()

    const [films, setFilms] = useState(null);

    useEffect(() => {
        const param = new URLSearchParams();
        if(user) param.append("userID", user.id);
        api.get(`${process.env.REACT_APP_SERVER}/api/films/home/get-home-page-films?${param.toString()}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [user, showNotification])

    return (
        <Box>
            <Box>
                <h1 id="titolo1"> CineSync</h1>
                
                <h2 id="sottotitolo">"Dove ogni film trova la sua voce"</h2>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px'}}>
                <Card sx={{borderRadius:"60px"}} className="card">
                    <CardMedia
                        component="img"
                        image="https://i.imgur.com/Abm0wRq.jpg"
                    />
                </Card>
            </Box>

            {
                films &&
                <Box>
                <Carosello films={films.currentPopularFilms} title="I film più popolari del momento 🎟️" link={"/films/current-popular-films"}/>
                <Carosello films={films.upcomingFilms} title="Film in uscita in Italia  🍕" link={"/films/upcoming-films"}/>
                <Carosello  films={films.topRatedFilms} title="Film più acclamati dalla critica  🌟" link={"/films/top-rated-films"}/>
                <Carosello films={films.nowPlayingFilms} title="Film attualmente al cinema  🍿" link={"/films/now-playing-films"} />
                <Carosello films={films.trendingFilms} title="Film in tendenza questa settimana  🔥" link={"/films/trending-films"}/>
                { films.similarFilms?.length > 0 && <Carosello films={films.similarFilms} title="Film simili a quelli che hai già visto ↪️" />}
                </Box>
        }
        </Box>

          )
}