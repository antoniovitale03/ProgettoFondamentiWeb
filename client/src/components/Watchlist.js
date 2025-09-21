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
    })

    const removeFromWatchlist = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dalla watchlist`, "success");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    return(
        //Ogni film è un Grid "item"
    //    xs={12} -> occupa 12 colonne (tutta la riga) su schermi extra-piccoli
    //    sm={6}  -> occupa 6 colonne (2 per riga) su schermi piccoli
    //    md={4}  -> occupa 4 colonne (3 per riga) su schermi medi
    //    lg={3}  -> occupa 3 colonne (4 per riga) su schermi grandi
        <Box>
            {watchlistFilms.length === 0 ? <p>La tua watchlist è vuota. Aggiungi qualche film!</p> :
                <Box>
                <h1>Vuoi guardare {watchlistFilms.length} film</h1>
                <Grid container spacing={2}>
                    { [...watchlistFilms].reverse().map((film) =>
                        <Grid item key={film._id} xs={12} sm={6} md={3} lg={3}>
                            <FilmCard film={film} showRemoveButton={true} onRemove={removeFromWatchlist}/>
                        </Grid>)
                    }
                </Grid>
                </Box>
            }
        </Box>
    )
}
export default Watchlist;