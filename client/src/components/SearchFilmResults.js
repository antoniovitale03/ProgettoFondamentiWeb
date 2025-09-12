import {useFilm} from "../context/filmContext";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./useDocumentTitle";
import {useParams} from "react-router-dom";
import {Grid} from "@mui/material";
//questo componente serve a mostrare i risultati di ricerca di un film
function SearchFilmResults() {

    let {filmTitle} = useParams();
    filmTitle = filmTitle.replaceAll("-", " ");
    const {filmsFromSearch} = useFilm();
    useDocumentTitle(`Mostra risultati per ${filmTitle}`);
    return(
        <div>
            {filmsFromSearch.length === 0 ? <p>Nessun film trovato</p> :
                <div>
                    <p>Risultati di ricerca per "<strong>{filmTitle}</strong>"</p>
                    <Grid container spacing={2}>
                        { filmsFromSearch.map((film) =>
                            <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard key={film._id} film={film}/>
                            </Grid>)}
                    </Grid>
                </div>
            }
        </div>
    )
}
export default SearchFilmResults;