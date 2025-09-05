import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";
import {useFilm, useFilms} from "../context/filmContext"
import api from "../api";
import {useNotification} from "../context/notificationContext";
function ListaFilm(){
    useDocumentTitle("Lista film")

    const {showNotification} = useNotification();
    const [watchedFilms, setWatchedFilms] = useState([]);
    const {getWatched} = useFilm()

    useEffect(()=>{
        async function getWatchedFilms(){
            try{
                const response = await api.get('http://localhost:5001/api/films/get-watched')
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms);
                console.log(watchedFilms);
            }catch(error){
                showNotification(error.response.data);
            }

        }
        getWatchedFilms();
    }, [getWatched])


    return(
        <div>
            <p>Qui inseriamo tutti i film visti dall'utente (locandina + voto(in stelle o numero) + eventuale like)</p>
            <p>L'utente può filtrare i film per genere, rating, film piaciuti (con like == true) e, se fosse possibile, la decade di uscita (1980s, 1990s, 2000s,...)</p>
            <h1>Hai visto {watchedFilms.length} film</h1>
            { watchedFilms.map((film) => <FilmCard key={film._id} film={film}/>) }


        </div>
    )
}

export default ListaFilm;