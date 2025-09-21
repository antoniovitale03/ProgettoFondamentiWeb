import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";

function ListaFilm(){

    useDocumentTitle("Lista dei film visti");
    const {showNotification} = useNotification();
    const [watchedFilms, setWatchedFilms] = useState([]);
    const [r, setR] = useState(23423);

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
    }, [r])

    const removeFromWatched = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dai film visti`, "success");
            setR(r - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box>
            {watchedFilms.length === 0 ? <p>Non hai ancora visto nessun film</p>:
                <Box>
                    <h1>Hai visto {watchedFilms.length} film</h1>
                    <Grid container spacing={2}>
                        { [...watchedFilms].reverse().map((film, index) =>
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} showRemoveButton={true} onRemove={removeFromWatched}/>
                            </Grid>)
                        }
                    </Grid>
                </Box>
            }
        </Box>
    )
}

export default ListaFilm;