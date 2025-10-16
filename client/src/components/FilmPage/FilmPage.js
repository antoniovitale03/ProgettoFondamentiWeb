import {useParams, Link} from 'react-router-dom';
import useDocumentTitle from "../hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import {Box,Button,Grid,Rating,Tooltip,Typography, Chip, Stack}from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import api from "../../api";
import FilmProviders from "./FilmProviders";
import CastCrewMoreInfo from "./CastCrewMoreInfo";
import FilmCollection from "./FilmCollection";
import FilmButtons from "./FilmButtons";
import '../../CSS/FilmPage.css';
import {useNotification} from "../../context/notificationContext"

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
        api.get(`http://localhost:5001/api/films/get-film/${filmID}`)
            .then(response => setFilm(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [filmTitle, filmID])


    if(!film){
        return(
            <Typography component="h1">Caricamento del film... </Typography>
        )
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
                {film?.title}
                <Button component={Link} to={`/films/${film.release_year}`}>( {film.release_year} )</Button>
                <Typography component="p" style={{margin:"0",fontSize:"clamp(18px,1.5vw,25px)"}}>Diretto da
                    <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                        <strong>{film?.director.name}</strong>
                    </Button>
                </Typography>
            </Typography>
            <Typography component="p">Durata: {film.duration}</Typography>
            <Grid container spacing={4}>
                <Grid size={{xs: 12, sm: 6, md: 4, lg:3}}>

                    <img className="locandina" src={film?.poster_path} alt="" />
                    {/* Bottoni per gestire il film */}
                    <FilmButtons film={film} />


                    { /* Rating */ }
                    {film.avgRating &&
                        <Box className="valutazione">
                            <Typography component="p" className="rating">Rating medio:  {film.avgRating}</Typography>
                            <Rating sx={{fontSize:{xs:"12px", md:"1.5vw"},alignItems:"center"}} name="rating" value={film.avgRating} precision={0.5} readOnly /> {/* //rating in quinti */}
                        </Box>
                    }
                    {film.userRating &&
                        <Box className="valutazione">
                            <Typography component="p" className="rating">Il mio rating:  </Typography>
                            <Rating sx={{fontSize:{xs:"12px", md:"1.5vw"}, alignItems:"center"}} name="rating" value={film.userRating} precision={0.5} readOnly /> {/* // il mio rating in quinti */}
                        </Box>
                    }

                    <FilmProviders rent={film.rent} flatrate={film.flatrate} buy={film.buy} />


                </Grid>

                {/* colonna di destra */}
                <Grid size={{ xs: 12, sm: 8}}>
                    <Typography component="p" className="testo">{film.tagline}</Typography> {/* //slogan film */}
                    <Typography component="p" className="testo">{film.overview}</Typography> {/* //trama */}
                    <Stack className="stack" direction="row" spacing={1}>
                        {film.trailerLink &&
                        <Button sx={{padding:"0"}} component={Link} to={film.trailerLink} target="_blank" rel="noreferrer">
                            <Tooltip title="Trailer">
                                <YouTubeIcon sx={{display:"flex", color:"red",fontSize:{xs:"20px", md:"2vw"}, padding: 0}}/>
                            </Tooltip>
                        </Button>
                    }
                    {film?.genres.map( genre =>
                        <Chip sx={{fontSize:"clamp(13px,1.2vw,25px)"}} label={genre.name} />) }
                    </Stack>

                    <CastCrewMoreInfo film={film} />

                    <Button sx={{margin:"15px",border: "1px solid black", fontSize:"13px"}} component={Link} to={`/film/${filmTitle.replaceAll(" ", "-")}/${filmID}/similar`}>
                      🎬 Film simili a "{film.title}"
                    </Button>

                    <FilmCollection collection={film.collection} />

                    </Grid>
                </Grid>
        </Box>



    )
}

export default FilmPage;