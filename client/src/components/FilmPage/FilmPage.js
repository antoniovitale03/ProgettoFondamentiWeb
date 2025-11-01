import {useParams, Link} from 'react-router-dom';
import useDocumentTitle from "../hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Button, Grid, Rating, Tooltip, Chip, Stack} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import {useAuth} from "../../context/authContext";

import * as React from "react";
import api from "../../api";
import FilmProviders from "./FilmProviders";
import CastCrewMoreInfo from "./CastCrewMoreInfo";
import FilmCollection from "./FilmCollection";
import FilmButtons from "./FilmButtons";
import '../../CSS/FilmPage.css';
import {useNotification} from "../../context/notificationContext";

// /film/filmTitle/filmID
export default function FilmPage(){

    let {filmTitle, filmID } = useParams(); // uso useParams per prelevare il titolo del film e il suo id direttamente dall'url
    //N.B.: se il titolo ha dei trattini, vanno rimpiazzati con gli spazi per poterlo cercare successivamente e mostrarlo nella pagina

    filmTitle = filmTitle.replaceAll("-", " ");
    useDocumentTitle(filmTitle);

    const {showNotification} = useNotification();
    const {isLoggedIn} = useAuth();


    const [film, setFilm] = useState(null);
    const [userRating, setUserRating] = useState(null);

    // Effetto per recuperare l'oggetto film dai parametri dell'url (filmTitle e filmID), viene recuperato ogni volta
    //che filmTitle e filmID cambiano, cioè quando l'utente carica la pagina di un altro film.
    useEffect( () => {
        api.get(`${process.env.REACT_APP_SERVER}/api/films/get-film/${filmID}`)
            .then( response => setFilm(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [filmTitle, filmID, showNotification])

    useEffect( () => {
        if(isLoggedIn){
            api.get(`${process.env.REACT_APP_SERVER}/api/films/get-film-user-rating/${filmID}`)
                .then(response => setUserRating(response.data))
                .catch(error => showNotification(error.response.data, "error"));
        }
    }, [filmTitle, filmID, showNotification, isLoggedIn])

    if(!film){
        return(
            <Box>Caricamento del film... </Box>
        )
    }

    return (
        <Box>
            <p className="titolo_film"> {film?.title}
                <Link className="link" id="link_anno" to={`/films/${film.release_year}`}>( {film.release_year} )</Link>
                <p className="titolo_film"> Diretto da
                    <Link className="link" to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                        {film?.director.name}
                    </Link>
                </p>
            </p>
            <p className="testo">Durata: {film.duration}</p>
            <Grid container spacing={4}>
                <Grid xs={12} sm={6} md={4} lg={3} size={3}>

                    <img className="locandina" src={film?.poster_path} alt="Locandina del film" />

                    {/* Bottoni per gestire il film */}
                    { isLoggedIn && <FilmButtons film={film} /> }

                    { /* Rating */ }
                    {film.avgRating &&
                        <Box className="valutazione">
                            <p className="rating">Rating medio:  {film.avgRating}</p>
                            <Rating sx={{fontSize:{xs:"12px", md:"1.5vw"},alignItems:"center"}} name="rating" value={film.avgRating} precision={0.5} readOnly /> {/* //rating in quinti */}
                        </Box>
                    }
                    {userRating &&
                        <Box className="valutazione">
                            <p className="rating">Il mio rating: </p>
                            <Rating sx={{fontSize:{xs:"12px", md:"1.5vw"},alignItems:"center"}} name="rating" value={userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
                        </Box>
                    }

                    <FilmProviders rent={film.rent} flatrate={film.flatrate} buy={film.buy} />


                </Grid>

                {/* colonna di destra */}
                <Grid xs={12} sm={8} size={8}>
                    <p className="testo">{film.tagline}</p> {/* //slogan film */}
                    <p className="testo">{film.overview}</p> {/* //trama */}
                    <Stack className="stack" direction="row" spacing={1}>
                        {film?.trailerLink &&
                            <Button sx={{padding:"0"}} component={Link} to={film.trailerLink} target="_blank" rel="noreferrer">
                                <Tooltip title="Trailer">
                                    <YouTubeIcon sx={{display:"flex", color:"#cad2c5",fontSize:{xs:"20px", md:"2vw"}, margin:"5px"}}/>
                                </Tooltip>
                            </Button>
                        }
                        {film?.genres.map( genre =>
                            <Chip sx={{fontSize:{xs:"13px", md:"1.2vw", color:"#cad2c5",backgroundColor: "#52796f",border:"1px solid black"}}} label={genre.name} />) }
                    </Stack>


                    <CastCrewMoreInfo film={film} />

                    🎬<Link className="link" id="film_simili" to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/similar`}>
                    Film simili a "{film.title}"</Link>

                    <Box>
                        <FilmCollection collection={film.collection} />
                    </Box>

                </Grid>
            </Grid>
        </Box>
    )
}