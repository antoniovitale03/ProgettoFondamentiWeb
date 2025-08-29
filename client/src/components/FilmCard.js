import {Box, Stack} from "@mui/material";
import {Link} from "@mui/material";

function FilmCard({film}){
    const title = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix
    return(
       <Box>
           <Stack spacing={4}>
               <Link href={`/film/${title}`} >{film.title}</Link>
               <img src={film.poster_path} alt="Locandina film"/>
               <p>{film.release_date}</p>
               <p>{film.director}</p>
               <p>-------</p>
           </Stack>
       </Box>
    )
}
export default FilmCard;