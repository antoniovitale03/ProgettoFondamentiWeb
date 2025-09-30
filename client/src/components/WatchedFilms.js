import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";

function WatchedFilms(){

    useDocumentTitle("Lista dei film visti");
    const {showNotification} = useNotification();
    const [watchedFilms, setWatchedFilms] = useState([]);

    useEffect(() => {
        const getWatchedFilms = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/watched/get-watched');
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getWatchedFilms();
    }, [watchedFilms, showNotification]);

    const removeFromWatched = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${filmID}`);
            showNotification(`"${filmTitle}" è stato rimosso dai film visti`, "success");
            setWatchedFilms(currentFilms =>
                currentFilms.filter(film => film.id !== filmID)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box marginBottom={10}>
            {watchedFilms.length === 0 ? <p>Non hai ancora visto nessun film</p> :
                <Box>
                    <h1>Hai visto {watchedFilms.length} film</h1>
                    <Grid container spacing={2}>
                        { [...watchedFilms].reverse().map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} showRemoveButton={true} onRemove={removeFromWatched}/>
                            </Grid>
                        )
                        }
                    </Grid>
                </Box>
            }
        </Box>
    )
}

export default WatchedFilms;