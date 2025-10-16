import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {Grid, Pagination, Stack} from "@mui/material";
import {useNotification} from "../../context/notificationContext";
import FilmCard from "../Cards/FilmCard";
import SearchFilters from "../SearchFilters";

function SimilarFilms(){

    const {showNotification} = useNotification();
    const {filmTitle, filmID} = useParams();
    useDocumentTitle(`Film simili a ${filmTitle}`);

    const [similarFilms, setSimilarFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const [filters, setFilters] = useState({
        page: 1,
        genre: "",
        decade: "",
        minRating: 0,
        sortByPopularity: "",
        sortByDate: ""
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.append("page", filters.page);
        if (filters.genre !== "") params.append("genre", filters.genre);
        if (filters.decade !== "") params.append("decade", filters.decade);
        if (filters.minRating !== 0) params.append("minRating", filters.minRating);
        if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
        if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);
        fetch(`http://localhost:5001/api/films/get-similar-films/${filmID}?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                setSimilarFilms(data.films);
                setTotalPages(data.totalPages);
            })
            .catch(() => showNotification("Errore nel caricamento dei film simili", "error"));
    }, [filmTitle, filmID, filters, showNotification])

    const handlePageChange = (event, value) => {
        setFilters({...filters, page: value});
        window.scrollTo(0, 0);
    }

    return(
        <Stack spacing={7} marginBottom={10}>
            <h1> Film simili a "{filmTitle.replaceAll("-", " ")}" </h1>

            <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

            {
                similarFilms.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }

            {
                similarFilms.length > 0 ?
                <p>{similarFilms.length * totalPages} film trovati</p>:
                <p>Nessun film trovato</p>
            }


            <Grid container spacing={2}>
                { similarFilms.length > 0 &&
                    similarFilms.map( film =>
                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <FilmCard film={film} />
                    </Grid>)
                }
            </Grid>

            {
                similarFilms.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }
        </Stack>
    )
}

export default SimilarFilms;