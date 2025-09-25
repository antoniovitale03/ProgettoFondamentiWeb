import {useParams, Link, NavLink} from 'react-router-dom';
import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext"
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Grid, ImageList, ImageListItem, ImageListItemBar,
    MenuItem,
    Rating,
    TextField, Tooltip,
    Typography, Chip
} from "@mui/material";
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
import ReviewsIcon from '@mui/icons-material/Reviews';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DropDownMenu from './DropDownMenu';
import * as React from "react";
import api from "../api";
import FilmCard from "./Cards/FilmCard";

// /film/filmTitle/filmID
function FilmPage(){

    let {filmTitle, filmID } = useParams(); // uso useParams per prelevare il titolo del film e il suo id direttamente dall'url
    //N.B.: se il titolo ha dei trattini, vanno rimpiazzati con gli spazi per poterlo cercare successivamente e mostrarlo nella pagina


    filmTitle = filmTitle.replaceAll("-", " ");
    useDocumentTitle(filmTitle);


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

    const addReview = async (film, review, reviewRating) => {
        try {
            await api.post('http://localhost:5001/api/films/reviews/add-review', {
                film, review, reviewRating
            })
            showNotification(`La recensione di "${filmTitle}" è stata salvata correttamente!`)
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
                setWatchlistButton(film?.filmStatus.isInWatchlist === true ? 0 : 1);
                setLikedButton(film?.filmStatus.isLiked === true ? 0 : 1);
                setReviewButton(film?.filmStatus.isReviewed === true ? 0 : 1);
                setFavoritesButton(film?.filmStatus.isFavorite === true ? 0 : 1);
                setWatchedButton(film?.filmStatus.isWatched === true ? 0 : 1);
            }
        }
        fetchFilm();
    }, [filmTitle, filmID])


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
            <Button onClick={() => addReview(film, review, reviewRating)}>
                Salva
            </Button>
        </>
    )

    if(!film){
        return(
            <Box>Caricamento del film... </Box>
        )
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
                {film?.title}
                <Button component={Link} to={`/films/${film.release_year}`}>( {film.release_year} )</Button>
            </Typography>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <img src={film?.poster_path} alt="Locandina del film" />
                    <p>Diretto da
                        <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                            <strong>{film?.director.name}</strong>
                        </Button>
                    </p>

                    { /* Rating */ }
                    {film.avgRating ?
                        <Box>
                            <p>Rating medio: {film.avgRating}</p>
                            <Rating name="rating" value={film.avgRating} precision={0.5} readOnly /> {/* //rating in quinti */}
                        </Box> : null
                    }
                    {film.userRating ?
                        <Box>
                            <p>Il mio rating: </p>
                            <Rating name="rating" value={film.userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
                        </Box> : null
                    }
                    {film?.rent ?
                        <Box>
                            <h2>Noleggia</h2>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                                { film.rent.map( film =>
                                    <Tooltip title={film.provider_name}>
                                        <img src={film.logo_path} style={{ width: '100%' }} />
                                    </Tooltip>
                                )
                                }
                            </Box>
                        </Box>
                        : null
                    }

                    { film?.flatrate ?
                        <Box>
                            <h2>Guarda in streaming</h2>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                                { film.flatrate.map( film =>
                                    <Tooltip title={film.provider_name}>
                                        <img src={film.logo_path} style={{ width: '100%' }} />
                                    </Tooltip>

                                )
                                }
                            </Box>
                        </Box> : null
                    }

                    { film?.buy ?
                        <Box>
                            <h2>Acquista</h2>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                                { film.buy.map( film =>
                                    <Tooltip title={film.provider_name}>
                                        <img src={film.logo_path} style={{ width: '100%' }} />
                                    </Tooltip>
                                )
                                }
                            </Box>
                        </Box> : null
                    }

                    {/* Bottoni per gestire il film */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap:6 }}>
                        {watchlistButton === 1 ?
                            <Tooltip title="Aggiungi alla watchlist">
                                <Button onClick={addToWatchlist}>
                                    <AccessTimeIcon />
                                </Button>
                            </Tooltip> :
                            <Tooltip title="Rimuovi dalla watchlist">
                                <Button onClick={removeFromWatchlist}>
                                    <AccessTimeFilledIcon />
                                </Button>
                            </Tooltip>
                        }
                        {likedButton === 1 ?
                            <Tooltip title="Aggiungi ai film piaciuti">
                                <Button onClick={addToLiked}>
                                    <ThumbUpOffAltIcon />
                                </Button>
                            </Tooltip> :
                            <Tooltip title="Rimuovi dai film piaciuti">
                                <Button onClick={removeFromLiked}>
                                    <ThumbUpIcon />
                                </Button>
                            </Tooltip>
                        }

                        {reviewButton === 1 ?
                            <Tooltip title="Aggiungi una recensione">
                                <DropDownMenu buttonContent={<ReviewsOutlinedIcon />} menuContent={reviewMenuItems} />
                            </Tooltip>
                            :
                            <Tooltip title="Rimuovi una recensione">
                                <Button onClick={deleteReview}>
                                    <ReviewsIcon />
                                </Button>
                            </Tooltip>
                        }

                        {favoritesButton === 1 ?
                            <Tooltip title="Aggiungi ai film preferiti">
                                <Button onClick={addToFavorites}>
                                    <FavoriteBorderIcon />
                                </Button>
                            </Tooltip>:
                            <Tooltip title="Rimuovi dai film preferiti">
                                <Button onClick={removeFromFavorites}>
                                    <FavoriteIcon />
                                </Button>
                            </Tooltip>
                        }

                        {watchedButton === 1 ?
                            <Tooltip title="Aggiungi ai film visti">
                                <Button onClick={addToWatched}>
                                    <AddCircleOutlineIcon />
                                </Button>
                            </Tooltip>
                             :
                            <Tooltip title="Rimuovi dai film visti">
                                <Button onClick={removeFromWatched}>
                                    <RemoveCircleOutlineIcon />
                                </Button>
                            </Tooltip>
                        }
                        { /* se aggiungo il film a quelli visti, lo posso riaggiungere se lo vedo altre volte
        //             {watchedButton === 0 ?
        //             <Button onClick={addToWatched}>
        //                 <VisibilityIcon />
        //                 <p>L'ho rivisto di nuovo</p>
        //             </Button>: null
        //             }
        //             </div>
        //             */ }
                    </Box>
                </Grid>

                {/* colonna di destra */}
                <Grid size={8}>
                    <p>{film.tagline}</p> {/* //slogan film */}
                    <p>{film.overview}</p> {/* //trama */}
                    {film?.trailerLink ?
                        <Button component={Link} to={film.trailerLink} target="_blank" rel="noreferrer">
                            <Tooltip title="Trailer">
                                <YouTubeIcon />
                            </Tooltip>
                        </Button> : null
                    }
                    {film?.genres.map( genre => <Chip label={genre.name} /> ) }

                    {/* Cast - Crew - Altre info */}
                    <Accordion sx={{ width: '50%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}> {/*parte visibile e cliccabile */}
                            <Typography>Cast</Typography>
                        </AccordionSummary>
                        <AccordionDetails> {/* parte visibile una volta cliccato il pannello*/}
                            <ImageList cols={3} gap={7} >
                                {film.castPreview.map((actor) =>
                                        <ImageListItem key={actor.id} component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>
                                            <img width='100%' height='100%' style={{ objectFit: 'cover' }}
                                                 src={actor.profile_path}
                                                 alt={actor.name}
                                            />
                                            <ImageListItemBar
                                                title = {actor.name}
                                                subtitle = {actor.character}
                                            />
                                        </ImageListItem>
                                    )
                                    }
                            </ImageList>
                            <div>
                                <NavLink to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/cast`}>
                                    Mostra altri...
                                </NavLink>
                            </div>
                            </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ width: '50%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>Crew</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ImageList cols={3} gap={7}>
                                {film.crewPreview.map( crewMember =>
                                        <ImageListItem key={crewMember.id}>
                                            <img
                                                src={crewMember.profile_path}
                                                alt={crewMember.name}
                                            />
                                            <ImageListItemBar
                                                title = {crewMember.name}
                                                subtitle = {crewMember.job}
                                            />
                                        </ImageListItem>
                                    )
                                    }
                            </ImageList>
                            <NavLink to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/crew`}>
                                Mostra altri...
                            </NavLink>
                        </AccordionDetails>
                    </Accordion>

                        <Accordion sx={{ width: '50%' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Altre info</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {detailsMenuItems}
                            </AccordionDetails>
                        </Accordion>
                    <Button component={Link} to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/similar`}>
                        Film simili a "{film.title}"
                    </Button>
                    { film?.collection ?
                        <Box>
                            <p>La saga completa</p>
                            <Grid container spacing={2}>
                                {film?.collection?.map( film =>
                                        <Grid key={film._id} size={2}>
                                            <FilmCard film={film} />
                                        </Grid>
                                )}
                            </Grid>
                        </Box> : null
                    }
                    </Grid>
                </Grid>
        </Box>



    )
}

export default FilmPage;