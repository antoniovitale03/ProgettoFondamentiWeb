import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";

function Watchlist(){
    useDocumentTitle("Watchlist");
    const {showNotification} = useNotification();

    const [watchlistFilms, setWatchlistFilms] = useState([]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/get-watchlist');
                const films = await response.data;
                setWatchlistFilms(films); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchWatchlist();
    }, [])

    if (watchlistFilms.length === 0) {
        return <div>La tua watchlist è vuota. Aggiungi qualche film!</div>;
    }

    return(
        <div>
            <p>Lista dei film da guardare</p>
            <h1>Vuoi guardare {watchlistFilms.length} film</h1>
            { watchlistFilms.map((film) => <FilmCard key={film.id} film={film} />) }
        </div>

    )
}
export default Watchlist;