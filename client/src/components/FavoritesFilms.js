import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";

function FavoritesFilms(){
    const [favoritesFilms, setFavoritesFilms] = useState([]);
    const {showNotification} = useNotification();
    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/get-favorites');
                const films = await response.data;
                setFavoritesFilms(films);
                console.log(films);
            }catch(error){
                showNotification(error.response.data);
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
            { favoritesFilms.map( ( (film,index) => <FilmCard key={film.id || index} film={film} />)) }
        </div>

    )
}
export default FavoritesFilms;