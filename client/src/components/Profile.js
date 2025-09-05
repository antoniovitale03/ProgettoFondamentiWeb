import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle"
import {Button, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./FilmCard";
import ReviewCard from "./ReviewCard";

function Profile(){
    const {user} = useAuth();
    const {showNotification} = useNotification();
    useDocumentTitle("Profilo")

    const [favoritesFilms, setFavoritesFilms] = useState([]);
    const [watchedFilms, setWatchedFilms] = useState([]);
    const [filmsReviews, setFilmsReviews] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/get-favorites');
                const films = await response.data;
                setFavoritesFilms(films);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchFavorites();
    }, [])

    useEffect(()=>{
        async function getWatchedFilms(){
            try{
                const response = await api.get('http://localhost:5001/api/films/get-watched')
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms)
            }catch(error){
                showNotification(error.response.data);
            }

        }
        getWatchedFilms();
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/get-reviews');
                const reviews = await response.data;
                setFilmsReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data);
            }
        }
        fetchReviews();
    });

    return (
        <div>
            {user && <Typography component="p">Benvenuto nel profilo, {user.username}!</Typography>}
            {user.name && user.surname && <Typography component="p">{user.name} {user.surname}</Typography>}
            {user.biography && <Typography component="p">{user.biography}</Typography>}
            {user.country && <Typography component="p">{user.country}</Typography>}
            <Button href="/settings/modify-profile">Modifica il profilo</Button>

            {favoritesFilms.length > 0 && <div>
                <h1>Film preferiti</h1>
                {favoritesFilms.map(film => <FilmCard key={film.id} film={film} /> )}
            </div>}

            <h1>Ultimi film visti (4)</h1>
            {watchedFilms.map(film => <FilmCard key={film.id} film={film} /> )}

            <h1>Ultime recensioni fatte (4): </h1>
            {filmsReviews.map(review => <ReviewCard key={review.id} review={review} /> )}

        </div>
    )
}

export default Profile;