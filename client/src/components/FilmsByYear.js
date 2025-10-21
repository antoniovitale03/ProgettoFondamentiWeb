import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import useDocumentTitle from "./hooks/useDocumentTitle";
import FilmCard from "./Cards/FilmCard";
import {Grid, Pagination, Stack, Typography} from "@mui/material";
import SearchFilters from "./SearchFilters";
import GetParams from "./hooks/useGetSearchParams";

function FilmsByYear(){
    let {year} = useParams();
    useDocumentTitle(`Film usciti nel ${year}`);

    const {showNotification} = useNotification();

    const [filters, setFilters] = useState({
        page: 1,
        genre: "",
        minRating: 0,
        sortByPopularity: "",
        sortByDate: ""
    });
    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0); // Per il numero totale di pagine

    //attivo l'effetto ogni volta che cambio pagina
    useEffect( () => {
        const params = GetParams(filters);
        api.get(`http://localhost:5001/api/films/get-films/${year}?${params.toString()}`)
            .then(response => {
                setFilms(response.data.films);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => showNotification(error.response.data, "error"));
    }, [filters, year, showNotification]);


    const handlePageChange = (event, value) => {
        setFilters({...filters, page: value});
        window.scrollTo(0, 0);
    };

    return(
        <Stack spacing={7} marginBottom={10}>

            <Typography component="h1" variant="strong">Film usciti nel {year} </Typography>

            {films.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }

            <SearchFilters filters={filters} setFilters={setFilters} decadeFilter={false} isLikedFilter={false} />

            <p>{films.length * totalPages} film trovati</p>


            <Grid container spacing={2}>
                {
                    films.map( film =>
                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <FilmCard film={film} />
                    </Grid>
                )}
            </Grid>

            {
                films.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }
        </Stack>
    )
}
export default FilmsByYear;