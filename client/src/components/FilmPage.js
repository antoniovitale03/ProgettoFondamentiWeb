import {useParams, useNavigate, Link, NavLink} from 'react-router-dom';
import {useFilm} from "../context/filmContext"
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
    const {getFilm, saveReview} = useFilm();
    const [film, setFilm] = useState(null);
    const [filmGenres, setFilmGenres] = useState([]);
    const [filmDetails, setFilmDetails] = useState([]);

    const [filmInfo, setFilmInfo] = useState([]);
    //rating in quinti
    const [avgRating, setAvgRating] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [reviewRating, setReviewRating] = useState(0);

    const [review, setReview] = useState("");


    //tutti i bottoni hanno stato 1 (aggiungi) o stato 0 (rimuovi)
    const [watchlistButton, setWatchlistButton] = useState(1);
    const [likedButton, setLikedButton] = useState(1);
    const [reviewButton, setReviewButton] = useState(1);
    const [favoritesButton, setFavoritesButton] = useState(1);
    const [watchedButton, setWatchedButton] = useState(1);

    let genreMenuItems = (<div>
        {filmGenres.map( (genre) => <MenuItem>{genre}</MenuItem> )}
    </div>)

    const addReview = async () => {
        await saveReview(film.title, film.release_year, review, reviewRating);
        showNotification(`La recensione di ${film.title}" è stata salvata correttamente!`)
        navigate(`/film/${filmTitle}/${filmID}`);
        setReviewButton(0);
    }

    let detailsMenuItems = (
        <div>
            <MenuItem>
                <h4>Original language: </h4>
                <p>{filmDetails.original_language}</p>
            </MenuItem>
            <MenuItem>
                <h4>Original country: </h4>
                <p>{filmDetails.origin_country?.[0]}</p>
            </MenuItem>
            <MenuItem>
                <h4>Spoken languages: </h4>
                { filmDetails.spoken_languages?.map( (language) => <p> {language} </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Production Companies:</h4>
                    { filmDetails?.production_companies?.map( e => <p> {e.name}({e.country}), </p>) }
            </MenuItem>
            <MenuItem>
                <h4>Revenue: </h4>
                <p>{filmDetails.revenue}</p>
            </MenuItem>
            <MenuItem>
                <h4>Budget: </h4>
                <p>{filmDetails.budget}</p>
            </MenuItem>
        </div>
    )

    let reviewMenuItems = (<>
            <TextField id="outlined-multiline-flexible" multiline rows={7} sx= {{ width: '350px' }} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
            <Rating name="review-rating" value={reviewRating} onChange={(event,rating) => setReviewRating(rating)} precision={0.5} />
            <Button onClick={addReview}>
                Salva
            </Button>
        </>
    )

    //bisognerà aggiungere delle funzioni che vedono se il film è nella watchlist o meno, restituisce true o false: se è true allora
    //fai vedere buttonState 0 altrimenti buttonState 1. questo
    const addToWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(0);
        try{
            await api.post("http://localhost:5001/api/films/add-to-watchlist", { film })
            showNotification(`${filmTitle} è stato aggiunto alla watchlist`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const removeFromWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/remove-from-watchlist/${filmID}`)
            showNotification(`${filmTitle.replaceAll("-", " ")} è stato rimosso dalla watchlist`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToLiked = async (event) => {
        event.preventDefault();
        setLikedButton(0);
        try{
            await api.post('http://localhost:5001/api/films/add-to-liked', { film })
            showNotification(`${filmTitle} è stato aggiunto ai film piaciuti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromLiked = async (event) => {
        event.preventDefault();
        setLikedButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/remove-from-liked/${filmID}`)
            showNotification(`${filmTitle} è stato rimosso dai film piaciuti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const deleteReview = async (event) => {
        event.preventDefault();
        setReviewButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/delete-review/${filmID}`)
            showNotification(`La recensione di ${filmTitle} è stata rimossa`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        setFavoritesButton(0);
        try{
            await api.post('http://localhost:5001/api/films/add-to-favorites', { film })
            showNotification(`${filmTitle} è stato aggiunto ai film preferiti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromFavorites = async (event) => {
        event.preventDefault();
        setFavoritesButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/remove-from-favorites/${filmID}`)
            showNotification(`${filmTitle} è stato rimosso dai film preferiti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addToWatched = async (event) => {
        event.preventDefault();
        setWatchedButton(0);
        try{
            await api.post('http://localhost:5001/api/films/add-to-watched', { film });
            showNotification(`${filmTitle} è stato aggiunto ai film visti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatched = async (event) => {
        event.preventDefault();
        setWatchedButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/remove-from-watched/${filmID}`);
            showNotification(`${filmTitle} è stato rimosso dai film visti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    // Effetto per recuperare l'oggetto film dai parametri dell'url (filmTitle e filmID), calcoli i generi e i dettagli
    useEffect( () => {
        async function fetchFilm(){
            if (filmTitle && filmID) {
                const film = await getFilm(filmTitle, filmID);
                setFilm(film);
                let filmGenres = film.genres.map( (genre) => {return genre.name})
                setFilmGenres(filmGenres)

                let filmDetails = {
                    production_companies: film.production_companies.map( e => {return {name: e.name, country: e.origin_country}}),
                    origin_country: film.origin_country,
                    original_language: film.original_language,
                    spoken_languages: film.spoken_languages.map(e => e.english_name),
                    budget: film.budget,
                    revenue: film.revenue,
                }
                setFilmDetails(filmDetails);
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
                setAvgRating(avgRating);
            }

            //calcolo rating inserito dall'utente, conoscendo l'id del film
            const response = await api.get(`http://localhost:5001/api/films/reviews/${filmID}`)
            const rating = await response.data;
            setUserRating(rating)
        }
        fetchRating();
    }, [film, filmID])

    //Effetto per calcolare se il film è nella watchlist o meno, se è stato piaciuto o meno ecc.. per renderizzare
    //correttamente i bottoni -> array di valori booleani(isWatched, isLiked, isReviewed, isFavorite, isWatched)
    useEffect( () => {
        async function fetchFilmInfo(){
            const response = await api.get(`http://localhost:5001/api/films/${filmID}`)
            let filmInfo = response.data;
            setFilmInfo(filmInfo);
            if ((filmInfo[0]) === true) {
                setWatchlistButton(0)
            }else{ setWatchlistButton(1) }

            if ((filmInfo[1]) === true){
                setLikedButton(0)
            }else{ setLikedButton(1) }

            if (filmInfo[2] === true){
                setReviewButton(0)
            }else{ setReviewButton(1) }

            if ((filmInfo[3]) === true){
                setFavoritesButton(0)
            }else{ setFavoritesButton(1) }

            if ((filmInfo[4]) === true){
                setWatchedButton(0)
            }else{ setWatchedButton(1) }
        }
        fetchFilmInfo();
    }, [filmID])




    if(!film){
        return(
            <div>Caricamento del film....</div>
        )
    }
    return (
        <Box>
            <p>Immagine background del film</p>
            <img src={film.backdrop_path} alt="Immagine in background del film"/>
            <p>Locandina del film</p>
            <img src={film.poster_path} alt="Locandina del film" />
            <p>{film.title} {film.release_year} Diretto da <NavLink to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>{film.director.name}</NavLink></p>
            <p>{film.tagline}</p> {/* //slogan film */}
            <p>{film.overview}</p> {/* //trama */}
            <div>
                <Button component={Link} to={`/film/${filmTitle}/cast`} state={{ cast: film.cast}} >
                Cast
                </Button>

                <Button component={Link} to={`/film/${filmTitle}/crew`} state={{ crew: film.crew}}>
                    Crew
                </Button>

                <DropDownMenu buttonContent="Dettagli" menuContent={detailsMenuItems} />

                <DropDownMenu buttonContent="Generi" menuContent={genreMenuItems} />
            </div>
            {avgRating !== null ? <div>
                <p>Rating medio: {avgRating}</p>
                <Rating name="rating" value={avgRating} precision={0.5} readOnly /> {/* //rating in quinti */}
                </div> : null
            }

            {userRating !== null ? <div>
                <p>Il tuo rating: </p>
                <Rating name="rating" value={userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
            </div> : null
            }

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
        </Box>

    )
}

export default FilmPage;