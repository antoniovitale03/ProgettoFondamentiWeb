import {Container, Box} from "@mui/material";
import {useFilm} from "../context/filmContext";
import FilmCard from "./FilmCard";
function SearchFilmResults() {
    const {filmsFromSearch} = useFilm();
    return(
        <Container>
            <Box>
                {filmsFromSearch.map(film => <FilmCard key={film.id} film={film}/>)}
            </Box>
        </Container>
    )
}
export default SearchFilmResults;