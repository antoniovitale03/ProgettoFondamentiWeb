import useDocumentTitle from "./hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid, Stack} from "@mui/material";
import {useAuth} from "../context/authContext";
import {useParams} from "react-router-dom";
import SearchFilters from "./SearchFilters";
import _ from "lodash"; //per la deep comparison

function WatchedFilms(){

    const {user} = useAuth();
    const {username} = useParams();
    const {showNotification} = useNotification();

    const [numWatched, setNumWatched] = useState(null);
    const [watched, setWatched] = useState(null);

    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: "",
        isLiked: null
    });

    useDocumentTitle(`Lista di ${username}`);

    const removeFromWatched = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${filmID}`);
            showNotification(`"${filmTitle}" è stato rimosso dai film visti`, "success");
            setWatched(currentFilms => currentFilms.filter(film => film.id !== filmID));
            setNumWatched(num => num - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect(() => {
        const getWatchedFilms = async () => {
            try{
                //primo rendering del componente, filtri nulli
                if( _.isEqual(filters, {genre: "", decade: "", minRating: 0, sortByDate: "", sortByPopularity: "", isLiked: null})){
                    const response = await api.get(`http://localhost:5001/api/films/watched/get-watched/${username}`);
                    const films = await response.data;
                    setWatched(films);
                    setNumWatched(films.length);
                }else{
                    const params = new URLSearchParams();
                    if (filters.genre !== "") params.append("genre", filters.genre);
                    if (filters.decade !== "") params.append("decade", filters.decade);
                    if (filters.minRating !== 0) params.append("minRating", filters.minRating);
                    if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
                    if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);
                    if (filters.isLiked !== null) params.append("isLiked", filters.isLiked); //parametro iniziale = false

                    const response = await api.get(`http://localhost:5001/api/films/watched/get-watched/${username}?${params.toString()}`);
                    const films = await response.data;
                    setWatched(films);
                }
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getWatchedFilms();
    }, [filters, username, showNotification]);


    return(
        <Box >
            {numWatched !== 0 && watched ?
                <Stack spacing={7}>
                    { user.username === username ? <h1>Hai visto {numWatched} film </h1> : <h1>{username} ha visto {numWatched} film</h1> }

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={true} />

                    <p>{watched.length} film trovati</p>

                    <Grid container spacing={2}>
                        { watched.map(film =>
                            <Grid key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromWatched}/>
                            </Grid>
                        )
                        }
                    </Grid>

                </Stack> :
                <Box>
                    { user.username === username ?
                        <h1>Non hai ancora visto nessun film</h1> :
                        <h1>{username} non ha ancora visto nessun film</h1>
                    }
                </Box>
            }
        </Box>
    )
}

export default WatchedFilms;