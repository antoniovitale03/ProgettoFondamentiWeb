import useDocumentTitle from "./hooks/useDocumentTitle";
import {Grid, Pagination, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import FilmCard from "./Cards/FilmCard";
import SearchFilters from "./SearchFilters";
import GetParams from "./hooks/useGetSearchParams";

function Archive(){
    useDocumentTitle("Archive");
    const {showNotification} = useNotification();

    const [archive, setArchive] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const [filters, setFilters] = useState({
        page: 1,
        genre: "",
        decade: "",
        minRating: 0,
        sortByPopularity: "",
        sortByDate: ""
    });

    const handlePageChange = (event, value) => {
        setFilters({...filters, page: value});
        window.scrollTo(0, 0);
    };

    //effetto che ricerca i film ogni volta che i filtri cambiano o viene cambia la pagina di ricerca dei film
    useEffect(() => {
        const params = GetParams(filters);
        api.get(`${process.env.REACT_APP_SERVER}/api/films/get-archive?${params.toString()}`)
            .then(response => {
                setArchive(response.data.films);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => {
                showNotification(error.response.data, "error");
                setTotalPages(0);
            });
    }, [filters, showNotification]);


    return(
        <Stack spacing={7}>

            <Typography component="h1" variant="h4" >
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

            <Typography component="p">{archive.length * totalPages} film trovati</Typography>

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