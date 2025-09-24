import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle"
import {Avatar, Box, Button, Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import ReviewCard from "./Cards/ReviewCard";
import {Link} from "react-router-dom";

function Profile(){
    const {user} = useAuth();

    const {showNotification} = useNotification();
    useDocumentTitle("Il mio profilo");

    const [favoritesFilms, setFavoritesFilms] = useState([]);
    const [watchedFilms, setWatchedFilms] = useState([]);
    const [filmsReviews, setFilmsReviews] = useState([]);
    const [r, setR] = useState(90332); //variabile di stato per tenere traccia di quando viene rimosso un film tra i preferiti

    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/favorites/get-favorites');
                const films = await response.data;
                setFavoritesFilms(films);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchFavorites();
    }, [r])

    useEffect(()=>{
        async function getWatchedFilms(){
            try{
                const response = await api.get('http://localhost:5001/api/films/watched/get-watched')
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms)
            }catch(error){
                showNotification(error.response.data, "error");
            }

        }
        getWatchedFilms();
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/reviews/get-reviews');
                const reviews = await response.data;
                setFilmsReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchReviews();
    }, []);

    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dai preferiti`, "success");
            setR(r - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }
    return (
        <Box>
            {user && <Typography component="p">Benvenuto nel profilo, {user.username}!</Typography>}
            {user.name && user.surname && <Typography component="p">{user.name} {user.surname}</Typography>}
            <Avatar />
            {user.biography && <Typography component="p">{user.biography}</Typography>}
            {user.country && <Typography component="p">{user.country}</Typography>}
            <Button href="/settings/modify-profile">Modifica il profilo</Button>

            {favoritesFilms.length > 0 ?
                <div>
                    <h1>Film preferiti</h1>
                    <Grid container spacing={2}>
                        {
                            [...favoritesFilms].reverse().map((film, index) =>
                            <Grid key={index} size={2}>
                                <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites}/>
                            </Grid>)
                        }
                    </Grid>
                </div>
                : null
            }

            {watchedFilms.length > 0 ?
                <div>
                    <h1>Ultimi film visti (4)</h1>
                    <Button component={Link} to="/lista-film">Vedi tutti i miei film visti</Button>
                    <Grid container spacing={2}>
                        { [...watchedFilms].reverse().slice(0, 4).map((film, index) =>
                            <Grid key={index} size={2}>
                                <FilmCard film={film}/>
                            </Grid>)
                        }
                    </Grid>
                </div>: null
            }


            {filmsReviews.length > 0 ?
                <Box sx={{ width: '90%' }}>
                    <h1>Ultime recensioni fatte (4): </h1>
                    <Button component={Link} to="/recensioni">Vedi tutte le mie recensioni</Button>
                    <Grid container spacing={2}>
                        { [...filmsReviews].reverse().slice(0, 4).map(review =>
                            <Grid key={review.filmID} size={6}>
                                <ReviewCard review={review}/>
                            </Grid>)}
                    </Grid>
                </Box> : null
            }

        </Box>
    )
}

export default Profile;