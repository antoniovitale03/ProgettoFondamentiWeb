import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";

function Watchlist(){
    useDocumentTitle("Watchlist");

    const [watchlistFilms, setWatchlistFilms] = useState([]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try{
                const response = await fetch('http://localhost:5001/api/films/get-watchlist', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Impossibile recuperare la watchlist.');
                }
                const films = await response.json();
                setWatchlistFilms(films); // Salviamo i film nello stato
            }catch(error){
                console.log(error);
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
            { watchlistFilms.map((film) => <FilmCard key={film.id} film={film} />) }
        </div>

    )
}
export default Watchlist;