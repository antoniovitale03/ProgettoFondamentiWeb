import { useParams } from 'react-router-dom';
import {useFilm} from "../context/filmContext"
import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import ReviewsIcon from '@mui/icons-material/Reviews';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
// /film/filmTitle/filmID
function FilmPage(){

    let {filmTitle, filmID } = useParams(); // uso useParams per prelevare il titolo del film e il suo id direttamente dall'url
    //N.B.: se il titolo ha dei trattini, vnano rimpiazzati con gli spazi per poterlo cercare successivamente e mostrarlo nella pagina
    filmTitle = filmTitle.replaceAll("-", " ");

    const {findFilm, addToWatchlist} = useFilm();
    const [film, setFilm] = useState(null);

    const handleSubmitWatchlist = async (event) => {
        event.preventDefault();
        try{
            await addToWatchlist(film);
        }catch(error){
            console.log(error);
        }

    }

    useDocumentTitle(filmTitle);



    useEffect( () => {
            async function trovafilm(){
                 const film = await findFilm(filmTitle, filmID);
                 setFilm(film);
                 console.log(film);
            }
            trovafilm();
         }, [filmTitle, filmID, findFilm]) //Ogni volta che cambia il titolo e/o l'id del film eseguo l'effetto, cioè trovo il film
                                            // e lo visualizzo in filmPage

    if(!film){
        return(
            <div>Caricamento del film....</div>
        )
    }
    return (
        <div>
            <p>Immagine background del film</p>
            <img src={film.backdrop_path} alt="Immagine in background del film"/>
            <p>Locandina del film</p>
            <img src={film.poster_path} alt="Locandina del film" />
            <p>{film.title} {film.release_date} Diretto da {film.director}</p>
            <p>{film.tagline}</p> {/* //slogan film */}
            <p>{film.overview}</p> {/* //trama */}
            <div>
                <Button>Cast</Button>
                <Button>Crew</Button>
                <Button>Dettagli</Button>
                <Button>Generi</Button>
            </div>
            <p>Rating medio: {film.vote_average}/10</p>
            <Button onClick={handleSubmitWatchlist}>
                <WatchLaterIcon />
                <p>Aggiungi alla Watchlist</p>
            </Button>
            <Button>
                <ThumbUpIcon />
                <p>Aggiungi ai film piaciuti</p>
            </Button>
            <Button>
                <ReviewsIcon />
                <p>Aggiungi una recensione</p>
            </Button>
            <Button>
                <FavoriteIcon />
                <p>Aggiungi ai film preferiti</p>
            </Button>
            <p>Voto inserito da te: </p>
        </div>

    )
}

export default FilmPage;