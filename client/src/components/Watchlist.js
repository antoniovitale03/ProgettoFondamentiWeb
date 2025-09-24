import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box, Grid} from "@mui/material";

function Watchlist(){
    useDocumentTitle("Watchlist");
    const {showNotification} = useNotification();
    const [watchlistFilms, setWatchlistFilms] = useState([]);
    const [r, setR] = useState(3382);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/watchlist/get-watchlist');
                const films = await response.data;
                setWatchlistFilms(films); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchWatchlist();
    }, [r])

    const removeFromWatchlist = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dalla watchlist`, "success");
            setR(r - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box marginBottom={10}>
            {watchlistFilms.length !== 0 ?
                <>
                <h1>Vuoi guardare {watchlistFilms.length} film</h1>
                <Grid container spacing={2}>
                    { [...watchlistFilms].reverse().map(film =>
                        <Grid key={film._id} size={2}>
                            <FilmCard film={film} showRemoveButton={true} onRemove={removeFromWatchlist}/>
                        </Grid>)
                    }
                </Grid>
                </>
                : <p>La tua watchlist è vuota. Aggiungi qualche film!</p>
            }
        </Box>
    )
}
export default Watchlist;