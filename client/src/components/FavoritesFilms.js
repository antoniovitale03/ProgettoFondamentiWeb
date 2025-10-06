import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";
import useDocumentTitle from "./hooks/useDocumentTitle"
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";

function FavoritesFilms(){
    const [favorites, setFavorites] = useState(null);
    const {showNotification} = useNotification();
    const {user} = useAuth();
    const {username} = useParams();
    useDocumentTitle(`Film preferiti di ${username}`);

    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await api.get(`http://localhost:5001/api/films/favorites/get-favorites/${username}`);
                const films = await response.data;
                setFavorites(films);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchFavorites();
    }, [showNotification]);

    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(`"${filmTitle}" è stato rimosso dai preferiti`, "success");
            setFavorites(currentFilms =>
                currentFilms.filter(film => film.id !== filmID)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    return(
        <Box>
            {favorites ?
                <Box>
                {user.username === username ? <h1>I tuoi {favorites.length} film preferiti</h1> : <h1>{username} ha {favorites.length} film preferiti</h1>}
                    <Grid container spacing={2}>
                        { favorites.map(film =>
                            <Grid key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromFavorites} />
                            </Grid>)
                        }
                    </Grid>
                </Box>:
                <Box>
                    {user.username === username ? <h1>Non hai ancora aggiunto nessun film ai tuoi preferiti</h1> : <h1>{username} non ha ancora aggiunto nessun film ai suoi preferiti</h1>}
                </Box>
            }
        </Box>
    )
}
export default FavoritesFilms;