import {Box, Button, Stack} from "@mui/material";
import {NavLink} from "react-router-dom";

function FilmCard({ film }){
    const title = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix
    return(
       <Box>
           <Stack spacing={4}>
               <NavLink to={`/film/${title}/${film.id}`}>{film.title}</NavLink>
               <img src={film.poster_path} alt="Locandina film"/>
               <p>Data di uscita: {film.release_date}</p>
               <p>Diretto da: {film.director}</p>
               <p>-------</p>
           </Stack>
       </Box>
    )
}
export default FilmCard;