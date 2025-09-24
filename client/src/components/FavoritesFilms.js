import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";
import useDocumentTitle from "./useDocumentTitle"

function FavoritesFilms(){
    const [favoritesFilms, setFavoritesFilms] = useState([]);
    const {showNotification} = useNotification();
    const [r, setR] = useState(8834);
    useDocumentTitle("I miei film preferiti");

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

    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dai preferiti`, "success");
            setR(r - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }



    return(
        <Box marginBottom={10}>
            {favoritesFilms.length === 0 ? <div>Non hai ancora aggiunto nessun film nei preferiti.</div> :
                <div>
                    <h1><strong>I tuoi 10 film preferiti</strong></h1>
                    <Grid container spacing={2}>
                        { [...favoritesFilms].reverse().map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites} />
                            </Grid>)
                        }
                    </Grid>
                </div>
            }
        </Box>
    )
}
export default FavoritesFilms;