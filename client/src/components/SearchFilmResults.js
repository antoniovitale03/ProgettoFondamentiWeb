import {useFilm} from "../context/filmContext";
import FilmCard from "./FilmCard";
function SearchFilmResults() {
    const {filmsFromSearch} = useFilm();
    return(
        <div>
            {filmsFromSearch.map(film => <FilmCard key={film.id} film={film}/>)}
        </div>
    )
}
export default SearchFilmResults;