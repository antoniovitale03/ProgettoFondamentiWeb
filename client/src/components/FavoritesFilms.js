import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid, Typography} from "@mui/material";
import useDocumentTitle from "./hooks/useDocumentTitle"
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";

function FavoritesFilms(){
    const [films, setFilms] = useState([]);
    const {showNotification} = useNotification();
    const {user} = useAuth();
    const {username} = useParams();
    useDocumentTitle(`Film preferiti di ${username}`);

    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(<strong><a href={`/film/${filmTitle}/${filmID}`} style={{ color: 'green' }}>{filmTitle}</a> rimosso dai tuoi preferiti</strong>, "success");
            setFilms(currentFilms =>
                currentFilms.filter(film => film.id !== filmID)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect(() => {
        api.get(`http://localhost:5001/api/films/favorites/get-favorites/${username}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [username, showNotification]);


    return(
        <Box>
            {films.length > 0 ?
                <Box>
                {user.username === username ?
                    <Typography component="h1" variant="strong">I tuoi {films.length} film preferiti</Typography>
                    : <Typography component="h1" variant="strong">{username} ha {films.length} film preferiti</Typography>}
                    <Grid container spacing={2}>
                        { films.map(film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromFavorites} />
                            </Grid>)
                        }
                    </Grid>
                </Box>:
                <Box>
                    {user.username === username ?
                        <Typography component="h1" variant="strong">Non hai ancora aggiunto nessun film ai tuoi preferiti</Typography>
                        : <Typography component="h1" variant="strong">{username} non ha ancora aggiunto nessun film ai suoi preferiti</Typography>
                    }
                </Box>
            }
        </Box>
    )
}
export default FavoritesFilms;