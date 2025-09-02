import {Box, Button, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";

function FilmCard({ film }){
    const navigate = useNavigate();
    const title = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix


    const handleClick = (event) => {
        event.preventDefault();
        if (!film.id){
            //l'oggetto film proviene dal popolamento della watchlist quindi avrà _id
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
               <Button onClick={handleClick}>{film.title}</Button>
               <img src={film.poster_path} alt="Locandina film"/>
               <p>Anno di uscita: {film.release_year}</p>
               {film.director ? <p>Diretto da: {film.director}</p> : null}
               {film.job ? <p>Ruolo: {film.job}</p> : null}
               <p>-------</p>
           </Stack>
       </Box>
    )
}
export default FilmCard;