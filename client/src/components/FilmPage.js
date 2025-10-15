import {useParams, Link} from 'react-router-dom';
import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext"
import {Box,Button,Grid,Rating,Tooltip,Typography, Chip, Stack}from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';

import * as React from "react";
import api from "../api";
import FilmProviders from "./FilmProviders";
import CastCrewMoreInfo from "./CastCrewMoreInfo";
import FilmCollection from "./FilmCollection";
import FilmButtons from "./FilmButtons";
import "../CSS/FilmPage.css"

// /film/filmTitle/filmID
function FilmPage(){

    let {filmTitle, filmID } = useParams(); // uso useParams per prelevare il titolo del film e il suo id direttamente dall'url
    //N.B.: se il titolo ha dei trattini, vanno rimpiazzati con gli spazi per poterlo cercare successivamente e mostrarlo nella pagina

    filmTitle = filmTitle.replaceAll("-", " ");
    useDocumentTitle(filmTitle);


    const {showNotification} = useNotification();
    const [film, setFilm] = useState(null);


    // Effetto per recuperare l'oggetto film dai parametri dell'url (filmTitle e filmID), viene recuperato ogni volta
    //che filmTitle e filmID cambiano, cioè quando l'utente carica la pagina di un altro film
    useEffect( () => {
        async function fetchFilm(){
            if (filmTitle && filmID) {
                const response = await api.get(`http://localhost:5001/api/films/getFilm/${filmTitle}/${filmID}`);
                const film = await response.data;
                setFilm(film);
            }
        }
        fetchFilm();
    }, [filmTitle, filmID])


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
                <p style={{margin:"0",fontSize:"clamp(18px,1.5vw,25px)"}}>Diretto da
                    <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                        <strong>{film?.director.name}</strong>
                    </Button>
                </p>
            </Typography>
            <Grid container spacing={4}>
                <Grid xs={12} sm={4} size={4}>

                    <img className="locandina" src={film?.poster_path} alt="Locandina del film" />
                    {/* Bottoni per gestire il film */}
                    <FilmButtons film={film} />


                    { /* Rating */ }
                    {film.avgRating ?
                        <Box className="valutazione">
                            <p className="rating">Rating medio:  {film.avgRating}</p>
                            <Rating sx={{fontSize:{xs:"12px", md:"1.5vw"},alignItems:"center"}} name="rating" value={film.avgRating} precision={0.5} readOnly /> {/* //rating in quinti */}
                        </Box> : null
                    }
                    {film.userRating ?
                        <Box className="valutazione">
                            <p className="rating">Il mio rating: </p>
                            <Rating sx={{fontSize:{xs:"12px", md:"1.5vw"},alignItems:"center"}} name="rating" value={film.userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
                        </Box> : null
                    }

                    <FilmProviders film={film} />


                </Grid>

                {/* colonna di destra */}
                <Grid xs={12} sm={8} size={8}>
                    <p className="testo">{film.tagline}</p> {/* //slogan film */}
                    <p className="testo">{film.overview}</p> {/* //trama */}
                    <Stack className="stack" direction="row" spacing={1}>
                        {film?.trailerLink ?
                        <Button sx={{padding:"0"}} component={Link} to={film.trailerLink} target="_blank" rel="noreferrer">
                            <Tooltip title="Trailer">
                                <YouTubeIcon sx={{display:"flex", color:"red",fontSize:{xs:"20px", md:"2vw"}, padding: 0}}/>
                            </Tooltip>
                        </Button> : null
                    }
                    {film?.genres.map( genre =>
                        <Chip sx={{fontSize:"clamp(13px,1.2vw,25px)"}} label={genre.name} />) }
                    </Stack>



                    <CastCrewMoreInfo film={film} />

                    <Button sx={{margin:"15px",border: "1px solid black", fontSize:"13px"}} component={Link} to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/similar`}>
                      🎬 Film simili a "{film.title}"
                    </Button>

                    <FilmCollection film={film} />

                    </Grid>
                </Grid>
        </Box>



    )
}

export default FilmPage;