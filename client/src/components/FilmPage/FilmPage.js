import {useParams, Link} from 'react-router-dom';
import useDocumentTitle from "../useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Button, Grid, Rating, Tooltip, Typography, Chip} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';

import * as React from "react";
import api from "../../api";

import FilmProviders from "./FilmProviders";
import CastCrewMoreInfo from "../CastCrewMoreInfo";
import FilmCollection from "./FilmCollection";
import FilmButtons from "./FilmButtons";

// /film/filmTitle/filmID
function FilmPage(){

    let {filmTitle, filmID } = useParams(); // uso useParams per prelevare il titolo del film e il suo id direttamente dall'url
    //N.B.: se il titolo ha dei trattini, vanno rimpiazzati con gli spazi per poterlo cercare successivamente e mostrarlo nella pagina

    filmTitle = filmTitle.replaceAll("-", " ");
    useDocumentTitle(filmTitle);

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
            </Typography>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <img src={film?.poster_path} alt="Locandina del film" />
                    <p>Diretto da
                        <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                            <strong>{film?.director.name}</strong>
                        </Button>
                    </p>
                    <p>Durata: {film.duration}</p>

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

                    {/* piattaforme di streaming */}
                    <FilmProviders film={film} />

                    {/* Bottoni per gestire il film */}
                    <FilmButtons film={film} />
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



                    <CastCrewMoreInfo film={film} />

                    <Button component={Link} to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/similar`}>
                        Film simili a "{film.title}"
                    </Button>

                    <FilmCollection film={film} />

                    </Grid>
                </Grid>
        </Box>



    )
}

export default FilmPage;