import {Box, Button, Rating, Stack} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import * as React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function FilmCard({ film }){
    const navigate = useNavigate();
    const title = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix


    const handleClick = () => {
        if (!film.id){
            //l'oggetto film proviene dal popolamento di un documento DB quindi avrà _id
            navigate(`/film/${title}/${film._id}`);
        }
        else{
            //l'oggetto film proviene dall'array SearchFilmsResults ottenuto con l'api TMDB avrà la proprietà id
            navigate(`/film/${title}/${film.id}`);
        }
    }

    return(
       <Box>
           <Stack spacing={4}>
               <Button onClick={handleClick}>{film.title}  ({film.release_year})</Button>

               <img src={film.poster_path} alt="Locandina film"/>

               { film.director ? <p>Diretto da: <NavLink to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>{film.director.name}</NavLink></p> : null }

               { film.job ? <p>Ruolo: {film.job}</p> : null }

               { film.rating !== undefined || null ? <Rating name="rating" value={film.rating} precision={0.5} readOnly /> : null }

               { film.isLiked === true ?  <ThumbUpIcon /> : null }
               <p>-------</p>
           </Stack>
       </Box>
    )
}
export default FilmCard;