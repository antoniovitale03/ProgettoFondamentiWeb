import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {useParams} from "react-router-dom";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import SearchFilters from "./SearchFilters";
import GetParams from "./hooks/useGetSearchParams";
//questo componente serve a mostrare i risultati di ricerca di un film
export default function SearchFilmResults() {

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
        const params = GetParams(filters);
        api.get(`${process.env.REACT_APP_SERVER}/api/films/get-search-results/${filmTitle}?${params.toString()}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [filmTitle, filters, showNotification])

    return(
        films ?
                <Stack spacing={7} marginBottom={10}>
                    <Typography component="h1">Risultati di ricerca per "<strong>{filmTitle}</strong>"</Typography>

                    <Typography component="p">{films.length} film trovati</Typography>

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

                    <Grid container spacing={2}>
                        { films.map(film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Stack>
                : <Typography component="h1">Caricamento dei risultati...</Typography>
    )
}