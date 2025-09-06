import {useFilm} from "../context/filmContext";
import FilmCard from "./FilmCard";
import useDocumentTitle from "./useDocumentTitle";
import {useParams} from "react-router-dom";
//questo componente serve a mostrare i risultati di ricerca di un film
function SearchFilmResults() {

    let {filmTitle} = useParams();
    filmTitle = filmTitle.replaceAll("-", " ");
    const {filmsFromSearch} = useFilm();
    useDocumentTitle(`Mostra risultati per ${filmTitle}`);
    return(
        <div>
            <p>Risultati di ricerca per "{filmTitle}"</p>
            { filmsFromSearch.map(film => <FilmCard key={film.id} film={film}/>) }
        </div>
    )
}
export default SearchFilmResults;