import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Grid, Pagination, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import FilmCard from "./Cards/FilmCard";
import SearchFilters from "./SearchFilters";


function Archive(){
    useDocumentTitle("Archive");
    const {showNotification} = useNotification();

    const [archive, setArchive] = useState([]);

    const [filters, setFilters] = useState({
        page: 1,
        genre: "",
        decade: "",
        minRating: 0,
        sortByPopularity: "",
        sortByDate: ""
    });

    const [totalPages, setTotalPages] = useState(0);

    //effetto che ricerca i film ogni volta che i filtri cambiano o viene cambia la pagina di ricerca dei film
    useEffect(() => {
        const fetchArchiveFilms = async () => {
            try{
                //costruisco i parametri di ricerca che vengono usati di default per mostrare i film al primo caricamento
                //della pagina
                const params = new URLSearchParams();
                params.append("page", filters.page) //page non può mai essere null
                if (filters.genre !== "") params.append("genre", filters.genre);
                if (filters.decade !== "") params.append("decade", filters.decade);
                if (filters.minRating !== 0) params.append("minRating", filters.minRating);
                if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);
                if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);

                const response = await api.get(`http://localhost:5001/api/films/get-archive?${params.toString()}`);

                setArchive(response.data.films);
                setTotalPages(response.data.totalPages);

            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
                setTotalPages(0);
            }
        }
        fetchArchiveFilms();
    }, [filters, showNotification]);

    const handlePageChange = (event, value) => {
        setFilters({...filters, page: value});
        window.scrollTo(0, 0);
    };

    return(
                <Stack spacing={7}>

                    <Typography variant="h4" component="h1">
                        Esplora l'Archivio
                    </Typography>

                    {archive.length > 0 &&
                        <Pagination
                            count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                            page={filters.page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    }


                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

                    <p>{archive.length * totalPages} film trovati</p>

                    <Grid container spacing={2}>
                        {archive.map(film => (
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} />
                            </Grid>
                        ))}
                    </Grid>

                        {archive.length > 0 &&
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

export default Archive;