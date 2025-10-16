import useDocumentTitle from "./hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box, Grid, Stack} from "@mui/material";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import _ from "lodash";
import SearchFilters from "./SearchFilters"; //per la deep comparison

function Watchlist(){

    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Watchlist di ${username}`);
    const {showNotification} = useNotification();
    const [watchlist, setWatchlist] = useState([]);
    const [numWatchlist, setNumWatchlist] = useState([]);

    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: "",
    });


    useEffect(() => {
        const getWatchlist = async () => {
            try{
                //primo rendering del componente, filtri nulli
                if( _.isEqual(filters, {genre: "", decade: "", minRating: 0, sortByDate: "", sortByPopularity: ""})){
                    const response = await api.get(`http://localhost:5001/api/films/watchlist/get-watchlist/${username}`);
                    const films = await response.data;
                    setWatchlist(films);
                    setNumWatchlist(films.length);
                }else{
                    const params = new URLSearchParams();
                    if (filters.genre !== "") params.append("genre", filters.genre);
                    if (filters.decade !== "") params.append("decade", filters.decade);
                    if (filters.minRating !== 0) params.append("minRating", filters.minRating);
                    if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
                    if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);

                    const response = await api.get(`http://localhost:5001/api/films/watchlist/get-watchlist/${username}?${params.toString()}`);
                    const films = await response.data;
                    setWatchlist(films);
                }
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getWatchlist();
    }, [username, filters, showNotification])

    const removeFromWatchlist = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${filmID}`);
            showNotification(<p>"{filmTitle}" è stato rimosso dalla tua <a href={`/${user.username}/watchlist`} style={{ color: 'green' }}>watchlist</a></p>, "success");
            setWatchlist(currentFilms => currentFilms.filter(film => film.id !== filmID));
            setNumWatchlist(num => num - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box>
            { numWatchlist !== 0 ?
                <Stack spacing={7}>
                    { user.username === username ? <h1>Vuoi guardare {numWatchlist} film </h1> : <h1>{username} vuole guardare {numWatchlist} film</h1> }

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false}/>

                    <p>{watchlist.length} film trovati</p>

                    <Grid container spacing={2}>
                        { watchlist?.map(film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromWatchlist}/>
                            </Grid>)
                        }
                    </Grid>
                </Stack> :
                <Box>
                    { user.username === username ?
                        <h1>La tua watchlist è vuota. Aggiungi qualche film!</h1> :
                        <h1>{username} non ha ancora aggiunto nessun film alla watchlist</h1>
                    }
                </Box>

            }
        </Box>
    )
}
export default Watchlist;