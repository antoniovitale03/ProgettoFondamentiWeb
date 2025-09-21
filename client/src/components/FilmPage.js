import {useParams, useNavigate, Link} from 'react-router-dom';
import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext"
import {Box, Button, MenuItem, Rating, TextField} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import YouTubeIcon from '@mui/icons-material/YouTube';

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
    const [film, setFilm] = useState(null);

    //rating in quinti
    const [reviewRating, setReviewRating] = useState(0);

    const [review, setReview] = useState("");


    //tutti i bottoni hanno stato 1 (aggiungi) o stato 0 (rimuovi)
    const [watchlistButton, setWatchlistButton] = useState(1);
    const [likedButton, setLikedButton] = useState(1);
    const [reviewButton, setReviewButton] = useState(1);
    const [favoritesButton, setFavoritesButton] = useState(1);
    const [watchedButton, setWatchedButton] = useState(1);

    const addReview = async (title, release_year, review, reviewRating) => {
        try {
            await api.post('http://localhost:5001/api/films/reviews/add-review', {
                title, release_year, review, reviewRating
            })
            showNotification(`La recensione di "${filmTitle}" è stata salvata correttamente!`)
            navigate(`/film/${filmTitle}/${filmID}`);
            setReviewButton(0);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(0);
        try{
            await api.post("http://localhost:5001/api/films/watchlist/add-to-watchlist", { film })
            showNotification(`${filmTitle} è stato aggiunto alla watchlist`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const removeFromWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${filmID}`)
            showNotification(`${filmTitle} è stato rimosso dalla watchlist`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToLiked = async (event) => {
        event.preventDefault();
        setLikedButton(0);
        try{
            await api.post('http://localhost:5001/api/films/liked/add-to-liked', { film })
            showNotification(`${filmTitle} è stato aggiunto ai film piaciuti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromLiked = async (event) => {
        event.preventDefault();
        setLikedButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/liked/remove-from-liked/${filmID}`)
            showNotification(`${filmTitle} è stato rimosso dai film piaciuti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const deleteReview = async (event) => {
        event.preventDefault();
        setReviewButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${filmID}`)
            showNotification(`La recensione di ${filmTitle} è stata rimossa`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        setFavoritesButton(0);
        try{
            await api.post('http://localhost:5001/api/films/favorites/add-to-favorites', { film })
            showNotification(`${filmTitle} è stato aggiunto ai film preferiti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromFavorites = async (event) => {
        event.preventDefault();
        setFavoritesButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`)
            showNotification(`${filmTitle} è stato rimosso dai film preferiti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addToWatched = async (event) => {
        event.preventDefault();
        setWatchedButton(0);
        //se ho visto un film, ovviamente viene eliminato dalla watchlist automaticamente
        setWatchlistButton(1);
        try{
            await api.post('http://localhost:5001/api/films/watched/add-to-watched', { film });
            showNotification(`${filmTitle} è stato aggiunto ai film visti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatched = async (event) => {
        event.preventDefault();
        setWatchedButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dai film visti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    // Effetto per recuperare l'oggetto film dai parametri dell'url (filmTitle e filmID), viene recuperato ogni volta
    //che filmTitle e filmID cambiano, cioè quando l'utente carica la pagina di un altro film
    useEffect( () => {
        async function fetchFilm(){
            if (filmTitle && filmID) {
                const response = await api.get(`http://localhost:5001/api/films/getFilm/${filmTitle}/${filmID}`);
                const film = await response.data;

                setFilm(film);

                //renderizzo i bottoni in base allo stato attuale del film
                setWatchlistButton(film.filmInfo[0] === true ? 0 : 1);
                setLikedButton(film.filmInfo[1] === true ? 0 : 1);
                setReviewButton(film.filmInfo[2] === true ? 0 : 1);
                setFavoritesButton(film.filmInfo[3] === true ? 0 : 1);
                setWatchedButton(film.filmInfo[4] === true ? 0 : 1);
            }
        }
        fetchFilm();
    }, [filmTitle, filmID])

    let genreMenuItems = (
        <div>
        {film?.genres.map( (genre) =>
            <MenuItem key={genre.id}>
                <strong>{genre.name}</strong>
            </MenuItem> )}
        </div>
    )

    let detailsMenuItems = (
        <div>
            <MenuItem>
                <h4>Original language: </h4>
                <p>{film?.details.original_language}</p>
            </MenuItem>
            <MenuItem>
                <h4>Original country: </h4>
                <p>{film?.details.origin_country?.[0]}</p>
            </MenuItem>
            <MenuItem>
                <h4>Spoken languages: </h4>
                { film?.details.spoken_languages?.map( (language) => <p> {language} </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Production Companies:</h4>
                { film?.details.production_companies?.map( e => <p> {e.name}({e.country}), </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Revenue: </h4>
                <p>{film?.details.revenue}</p>
            </MenuItem>
            <MenuItem>
                <h4>Budget: </h4>
                <p>{film?.details.budget}</p>
            </MenuItem>
        </div>
    )

    let reviewMenuItems = (<>
            <TextField id="outlined-multiline-flexible" multiline rows={7} sx= {{ width: '350px' }} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
            <Rating name="review-rating" value={reviewRating} onChange={(event,rating) => setReviewRating(rating)} precision={0.5} />
            <Button onClick={() => addReview(film?.title, film?.release_year, review, reviewRating)}>
                Salva
            </Button>
        </>
    )

    if(!film){
        return(
            <div>Caricamento del film... </div>
        )
    }

    return (
        <Box>
            <p>Immagine background del film</p>
            <img src={film?.backdrop_path} alt="Immagine in background del film"/>

            <p>Locandina del film</p>
            <p>
                <strong>{film?.title}</strong>
                <Button component={Link} to={`/films/${film.release_year}`}>( {film.release_year} )</Button>
            </p>

            <img src={film?.poster_path} alt="Locandina del film" />
            <p>Diretto da
                <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                <strong>{film?.director.name}</strong>
                </Button>
            </p>
            <p>{film.tagline}</p> {/* //slogan film */}
            <p>{film.overview}</p> {/* //trama */}
            {film?.trailerLink ?
                <Button component={Link} to={film.trailerLink} target="_blank" rel="noreferrer">
                    <YouTubeIcon />
                    <p>Trailer</p>
                </Button> : null
            }


            <div style={{ display:"flex", flexDirection: 'row' }}>
                <Button component={Link} to={`/film/${filmTitle}/cast`} state={{ cast: film.cast}} >
                Cast
                </Button>

                <Button component={Link} to={`/film/${filmTitle}/crew`} state={{ crew: film.crew}}>
                    Crew
                </Button>

                <DropDownMenu buttonContent="Dettagli" menuContent={detailsMenuItems} />

                <DropDownMenu buttonContent="Generi" menuContent={genreMenuItems} />
            </div>
            {film.avgRating !== null ? <div>
                <p>Rating medio: {film.avgRating}</p>
                <Rating name="rating" value={film.avgRating} precision={0.5} readOnly /> {/* //rating in quinti */}
                </div> : null
            }

            {film.userRating !== null ? <div>
                <p>Il tuo rating: </p>
                <Rating name="rating" value={film.userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
            </div> : null
            }

            <div style={{ textAlign: 'center' }}>

            </div>

            <div>
            {watchlistButton === 1 ?
                <Button onClick={addToWatchlist}>
                <AccessTimeIcon />
                <p>Aggiungi alla Watchlist</p>
                </Button> :
                <Button onClick={removeFromWatchlist}>
                    <AccessTimeFilledIcon />
                    <p>Rimuovi dalla watchlist</p>
                </Button>
            }

            {likedButton === 1 ?
            <Button onClick={addToLiked}>
                <ThumbUpOffAltIcon />
                <p>Aggiungi ai film piaciuti</p>
            </Button> :
                <Button onClick={removeFromLiked}>
                    <ThumbUpIcon />
                    <p>Rimuovi dai film piaciuti</p>
                </Button>
            }

            {reviewButton === 1 ?
                <DropDownMenu buttonContent="Aggiungi una recensione" menuContent={reviewMenuItems} />
                :
                <Button onClick={deleteReview}>
                    <CloseOutlinedIcon />
                    <p>Rimuovi recensione</p>
                </Button>
            }



            {favoritesButton === 1 ?
                <Button onClick={addToFavorites}>
                    <FavoriteBorderIcon />
                    <p>Aggiungi ai film preferiti</p>
                </Button> :
                <Button onClick={removeFromFavorites}>
                    <FavoriteIcon />
                    <p>Rimuovi dai preferiti</p>
                </Button>
            }

            {watchedButton === 1 ?
                <Button onClick={addToWatched}>
                    <AddCircleOutlineIcon />
                    <p>Aggiungi ai film visti</p>
                </Button> :
                <Button onClick={removeFromWatched}>
                    <RemoveCircleOutlineIcon />
                    <p>Rimuovi dai film visti</p>
                </Button>
            }

            { /* se aggiungo il film a quelli visti, lo posso riaggiungere se lo vedo altre volte*/ }
            {watchedButton === 0 ?
            <Button onClick={addToWatched}>
                <VisibilityIcon />
                <p>L'ho rivisto di nuovo</p>
            </Button>: null
            }
            </div>

            {/* mostro i film simili */}
            <Button component={Link} to={`/film/${filmTitle}/${filmID}/similar`}>
                Film simili a "{film.title}"
            </Button>
        </Box>
    )
}

export default FilmPage;