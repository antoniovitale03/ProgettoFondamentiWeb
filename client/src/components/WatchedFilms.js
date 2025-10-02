import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";
import {useAuth} from "../context/authContext";
import {useParams} from "react-router-dom";
function WatchedFilms(){


    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Lista di ${username}`);

    const {showNotification} = useNotification();
    const [watchedFilms, setWatchedFilms] = useState([]);

    useEffect(() => {
        const getWatchedFilms = async () => {
            try{
                const response = await api.get(`http://localhost:5001/api/films/watched/get-watched/${username}`);
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getWatchedFilms();
    }, [showNotification]);

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
            {watchedFilms.length !== 0 ?
                <Box>
                    {
                        user.username === username ? <h1>Hai visto {watchedFilms.length} film </h1> : <h1>{username} ha visto {watchedFilms.length} film</h1>
                    }
                    <Grid container spacing={2}>
                        { watchedFilms.map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromWatched}/>
                            </Grid>
                        )
                        }
                    </Grid>
                </Box> :
                <Box>
                    {
                        user.username === username ? <h1>Non hai ancora visto nessun film</h1> : <h1>{username} non ha ancora visto nessun film</h1>
                    }
                </Box>


            }
        </Box>
    )
}

export default WatchedFilms;