import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box, Grid} from "@mui/material";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";

function Watchlist(){

    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Watchlist di ${username}`);
    const {showNotification} = useNotification();
    const [watchlistFilms, setWatchlistFilms] = useState([]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try{
                const response = await api.get(`http://localhost:5001/api/films/watchlist/get-watchlist/${username}`);
                const films = await response.data;
                setWatchlistFilms(films); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchWatchlist();
    }, [showNotification])

    const removeFromWatchlist = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${filmID}`);
            showNotification(`"${filmTitle}" è stato rimosso dalla watchlist`, "success");
            setWatchlistFilms(currentFilms =>
                currentFilms.filter(film => film.id !== filmID)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box>
            {watchlistFilms.length !== 0 ?
                <Box>
                    {
                        user.username === username ? <h1>Vuoi guardare {watchlistFilms.length} film </h1> : <h1>La watchlist di {username}</h1>
                    }
                    <Grid container spacing={2}>
                        { watchlistFilms.map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromWatchlist}/>
                            </Grid>)
                        }
                    </Grid>
                </Box>
                :
                <Box>
                    {
                        user.username === username ? <h1>La tua watchlist è vuota. Aggiungi qualche film!</h1> : <h1>{username} non ha ancora aggiunto nessun film alla watchlist</h1>
                    }
                </Box>

            }
        </Box>
    )
}
export default Watchlist;