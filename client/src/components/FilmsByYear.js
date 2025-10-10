import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import useDocumentTitle from "./hooks/useDocumentTitle";
import FilmCard from "./Cards/FilmCard";
import { Grid, Pagination, Stack} from "@mui/material";
import SearchFilters from "./SearchFilters";

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
        async function fetchFilmsByYear(){
            try{
                const params = new URLSearchParams();
                params.append("page", filters.page);
                if(filters.genre !== "") params.append("genre", filters.genre);
                if(filters.minRating !== 0) params.append("minRating", filters.minRating);
                if(filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);
                if(filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
                const response = await api.get(`http://localhost:5001/api/films/get-films/${year}?${params.toString()}`);
                let data = response.data;
                setFilms(data.films);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }
        }
        fetchFilmsByYear();
    }, [filters, year, showNotification]);


    const handlePageChange = (event, value) => {
        setFilters({...filters, page: value});
        window.scrollTo(0, 0);
    };

    return(
        <Stack spacing={7} marginBottom={10}>

            <h1>Film usciti nel {year} </h1>

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
                    <Grid key={film._id} xs={12} sm={6} md={4} lg={3}>
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