import {Box, Button, Rating, Stack} from "@mui/material";
import {NavLink, useNavigate, Link} from "react-router-dom";
import * as React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function FilmCard({ film }){
    const navigate = useNavigate();
    const title = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix



    return(
       <Box>
           <Stack spacing={4}>
               <Link to={`/film/${title}/${film._id}`}>{film.title}</Link>
               <Link to={`/films/${film.release_year}`}>({film.release_year})</Link>

               <img onClick={() => navigate(`/film/${title}/${film._id}`)} src={film.poster_path} alt="Locandina film"/>

               { film.director ? <p>Diretto da: <NavLink to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>{film.director.name}</NavLink></p> : null }

               {film.date ? <p>Data della visione: {film.date}</p> : null}

               { film.job ? <p>Ruolo: {film.job}</p> : null }

               { film.rating === null ? null :
                 film.rating === undefined ? null :
                     <Rating name="rating" value={film.rating} precision={0.5} readOnly />
               }

               { film.isLiked === true ?  <ThumbUpIcon /> : null }
               <p>-------</p>
           </Stack>
       </Box>
    )
}
export default FilmCard;