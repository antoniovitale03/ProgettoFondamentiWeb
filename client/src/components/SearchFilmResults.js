import {useFilm} from "../context/filmContext";
import FilmCard from "./FilmCard";
import useDocumentTitle from "./useDocumentTitle";
//questo componente serve a mostrare i risultati di ricerca di un film
function SearchFilmResults() {
    const {searchQuery, filmsFromSearch} = useFilm();
    console.log(filmsFromSearch);
    useDocumentTitle(`Mostra risultati per ${searchQuery}`)
    return(
        <div>
            <p>Risultati di ricerca per "{searchQuery}"</p>
            { filmsFromSearch.map(film => <FilmCard key={film.id} film={film}/>) }
        </div>
    )
}
export default SearchFilmResults;