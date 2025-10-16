import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {useParams} from "react-router-dom";
import {Box, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import SearchFilters from "./SearchFilters";
//questo componente serve a mostrare i risultati di ricerca di un film
function SearchFilmResults() {

    let {filmTitle} = useParams();
    filmTitle = filmTitle.replaceAll("-", " ");
    useDocumentTitle(`Mostra risultati per "${filmTitle}"`);

    const {showNotification} = useNotification();
    const [films, setFilms] = useState(null);
    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: ""
    });

    useEffect( () => {
        const params = new URLSearchParams();
        if (filters.genre !== "") params.append("genre", filters.genre)
        if (filters.decade !== "") params.append("decade", filters.decade)
        if (filters.minRating !== 0) params.append("minRating", filters.minRating)
        if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate)
        if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity)
        api.get(`http://localhost:5001/api/films/get-search-results/${filmTitle}?${params.toString()}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [filmTitle, filters, showNotification])

    return(
        <Box marginBottom={10}>
            {films ?
                <Box>
                    <h1>Risultati di ricerca per "<strong>{filmTitle}</strong>"</h1>

                    <p>{films.length} film trovati</p>

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

                    <Grid container spacing={2}>
                        { films.map(film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
                : <h1>Caricamento dei risultati...</h1>
            }
        </Box>
    )
}
export default SearchFilmResults;