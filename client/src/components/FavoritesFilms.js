import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";

function FavoritesFilms(){
    const [favoritesFilms, setFavoritesFilms] = useState([]);
    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await fetch('http://localhost:5001/api/films/get-favorites', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Impossibile recuperare la watchlist.');
                }
                const films = await response.json();
                setFavoritesFilms(films);
            }catch(error){
                console.log(error);
            }
        }
        fetchFavorites();
    }, [])

    if (favoritesFilms.length === 0) {
        return <div>Non hai ancora aggiunto nessun film nei preferiti.</div>;
    }

    return(
        <div>
            <p>Qui inseriamo i 10 film preferiti dall'utente</p>
            {favoritesFilms.map( film => <FilmCard key={film.id} film={film} />)}
        </div>

    )
}
export default FavoritesFilms;