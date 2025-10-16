import {useAuth} from "../context/authContext"
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Card, CardMedia, Typography} from "@mui/material";
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
        const param = new URLSearchParams();
        if(user) param.append("userID", user.id);
        api.get(`http://localhost:5001/api/films/home/get-home-page-films?${param.toString()}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [user, showNotification])

    return (
        <Box>
            <Box>
                {user ? <Typography component="h6" >Benvenuto nella home, {user.username}!</Typography>
                : <Typography component="h1" id="titolo1"> Nome del sito</Typography>
                }
                <Typography component="h2" id="sottotitolo">slogan del sito</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px'}}>
                <Card sx={{borderRadius:"60px"}} className="card">
                    <CardMedia component="img" image="http://i.imgur.com/Abm0wRq.jpg" />
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
                { films.similarFilms && <Carosello films={films.similarFilms} title="Film simili a quelli che hai già visto ↪️" />}
                </Box>
        }
        </Box>
    )
}
export default Home;