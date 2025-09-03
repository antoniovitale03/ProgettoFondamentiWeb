import {useParams, useNavigate, Link, NavLink} from 'react-router-dom';
import {useFilm} from "../context/filmContext"
import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext"
import {Button, MenuItem, Rating} from "@mui/material";
import ReviewsIcon from '@mui/icons-material/Reviews';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';


import DropDownMenu from './DropDownMenu';
import * as React from "react";
import api from "../api";
// /film/filmTitle/filmID
function FilmPage(){

    let {filmTitle, filmID } = useParams(); // uso useParams per prelevare il titolo del film e il suo id direttamente dall'url
    //N.B.: se il titolo ha dei trattini, vanno rimpiazzati con gli spazi per poterlo cercare successivamente e mostrarlo nella pagina

    useDocumentTitle(filmTitle.replaceAll("-", " "));

    const navigate = useNavigate();
    const {showNotification} = useNotification();
    const {getFilm} = useFilm();
    const [film, setFilm] = useState(null);
    const [filmGenres, setFilmGenres] = useState([]);
    //rating in quinti
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);

    let menuItems = (<>
        {filmGenres.map( (genre) => <MenuItem>{genre}</MenuItem> )}
    </>)


    const addToWatchlist = async (event) => {
        event.preventDefault();
        try{
            await api.post("http://localhost:5001/api/films/add-to-watchlist", { film })
        }catch(error){
            showNotification(error.response.data);
        }
        showNotification(<>
                "{filmTitle}" è stato aggiunto alla watchlist
            </>
        )
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/add-to-favorites', { film })
            showNotification(<>
                "{filmTitle}" è stato aggiunto alla lista dei preferiti
                </>
            )
        }catch(error){
            showNotification(error.response.data);
        }
    }

    const addToLiked = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/add-to-liked', { film })
            showNotification(<>
                "{filmTitle}" è stato aggiunto ai film piaciuti
            </>)
        }catch(error){
            showNotification(error.response.data);
        }
    }

    const addToWatched = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/add-to-watched', { film });
            showNotification(<>
                "{filmTitle}" è stato aggiunto ai film visti</>)
        }catch(error){
            showNotification(error.response.data);
        }
    }



    // Effetto per recuperare l'oggetto film dai parametri dell'url (filmTitle e filmID)
    useEffect( () => {
        async function fetchFilm(){
            if (filmTitle && filmID) {
                const film = await getFilm(filmTitle, filmID);
                setFilm(film);
            }
        }
        fetchFilm();
    }, [filmTitle, filmID, getFilm])

    //Effetto per calcolare il rating medio e il rating inserito dall'utente, solo se il film esiste
    useEffect( () => {
        async function fetchRating(){
            //calcolo rating medio
            if(film && film.vote_average !== 0){
                let avgRating = (film.vote_average)/2; //rating in quinti
                avgRating = Number(avgRating.toFixed(1)); //lo blocco ad una cifra decimale
                setRating(avgRating);
            }

            //calcolo rating inserito dall'utente, conoscendo l'id del film
            const response = await fetch(`http://localhost:5001/api/films/reviews/${filmID}`, {
                method: 'GET',
                credentials: "include"
            })
            const rating = await response.json();
            setUserRating(rating)
        }
        fetchRating();
    }, [film])

    //Effetto per calcolare i generi di un film
    useEffect( () => {
        if (film){
            let filmGenres = film.genres.map( (genre) => {return genre.name})
            setFilmGenres(filmGenres)
        }
        }, [film])


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
            <p>{film.title} {film.release_year} Diretto da {film.director}</p>
            <p>{film.tagline}</p> {/* //slogan film */}
            <p>{film.overview}</p> {/* //trama */}
            <div>
                <Button component={Link} to={`/film/${filmTitle}/cast`} state={{ cast: film.cast}} >
                Cast
                </Button>

                <Button component={Link} to={`/film/${filmTitle}/crew`} state={{ crew: film.crew}}>
                    Crew
                </Button>

                <Button>Dettagli</Button>

                <DropDownMenu buttonContent="Generi" menuContent={menuItems} />
            </div>
            {rating !== 0 ? <div>
                <p>Rating medio: {rating}</p>
                <Rating name="rating" value={rating} precision={0.5} readOnly /> {/* //rating in quinti */}
                </div> : null
            }

            {userRating !== 0 ? <div>
                <p>Il tuo rating: </p>
                <Rating name="rating" value={userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
            </div> : null
            }

            <Button onClick={addToWatchlist}>
                <WatchLaterIcon />
                <p>Aggiungi alla Watchlist</p>
            </Button>

            <Button onClick={addToLiked}>
                <ThumbUpIcon />
                <p>Aggiungi ai film piaciuti</p>
            </Button>

            <Button href="/log-a-film">
                <ReviewsIcon />
                <p>Aggiungi una recensione</p>
            </Button>

            <Button onClick={addToFavorites}>
                <FavoriteIcon />
                <p>Aggiungi ai film preferiti</p>
            </Button>

            <Button onClick={addToWatched}>
                <AddIcon />
                <p>Aggiungi ai film visti</p>
            </Button>

            <Button>
                <p>Rimuovi dalla watchlist</p>
            </Button>

            <Button>
                <p>Rimuovi dai film piaciuti</p>
            </Button>

            <Button>
                <p>Rimuovi recensione</p>
            </Button>


            <Button>
                <p>Rimuovi dai film preferiti</p>
            </Button>


            <Button>
                <p>Rimuovi dai film visti</p>
            </Button>
        </div>

    )
}

export default FilmPage;