import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Grid} from "@mui/material";

function FavoritesFilms(){
    const [favoritesFilms, setFavoritesFilms] = useState([]);
    const {showNotification} = useNotification();
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

    if (favoritesFilms.length === 0) {
        return <div>Non hai ancora aggiunto nessun film nei preferiti.</div>;
    }

    return(
        <div>
            <p>Qui inseriamo i 10 film preferiti dall'utente</p>
            <Grid container spacing={2}>
                { [...favoritesFilms].reverse().map((film) =>
                    <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                        <FilmCard key={film._id} film={film}/>
                    </Grid>)}
            </Grid>
        </div>

    )
}
export default FavoritesFilms;