import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./useDocumentTitle";
import {useParams} from "react-router-dom";
import {Box, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";
//questo componente serve a mostrare i risultati di ricerca di un film
function SearchFilmResults() {

    let {filmTitle} = useParams();
    filmTitle = filmTitle.replaceAll("-", " ");
    useDocumentTitle(`Mostra risultati per ${filmTitle}`);

    const [filmsFromSearch, setFilmsFromSearch] = useState(null);

    useEffect( () => {
        async function fetchSearchResults(){
            const response = await api.post('http://localhost:5001/api/films/get-film-search-results', { filmTitle });
            let films = await response.data;
            setFilmsFromSearch(films);
        }
        fetchSearchResults();
    }, [filmTitle]) // eseguo l'effetto ogni volta che cambia la query di ricerca

    return(
        <Box marginBottom={10}>
            {filmsFromSearch ?
                <Box>
                    <p>Risultati di ricerca per "<strong>{filmTitle}</strong>"</p>
                    <Grid container spacing={2}>
                        { filmsFromSearch.map(film =>
                            <Grid key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
                : <p>Nessun film trovato</p>
            }
        </Box>
    )
}
export default SearchFilmResults;