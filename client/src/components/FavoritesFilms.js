import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";

function FavoritesFilms(){
    const [favoritesFilms, setFavoritesFilms] = useState([]);
    const {showNotification} = useNotification();

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
    })

    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dai preferiti`, "success");
            //refresho la pagina
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }



    return(
        <Box>
            {favoritesFilms.length === 0 ? <div>Non hai ancora aggiunto nessun film nei preferiti.</div> :
                <div>
                    <h1><strong>I tuoi 10 film preferiti</strong></h1>
                    <Grid container spacing={2}>
                        { [...favoritesFilms].reverse().map((film) =>
                            <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard key={film._id} film={film} showRemoveButton={true} onRemove={removeFromFavorites} />
                            </Grid>)
                        }
                    </Grid>
                </div>
            }
        </Box>
    )
}
export default FavoritesFilms;