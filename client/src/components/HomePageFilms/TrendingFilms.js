import {useEffect, useState} from "react";
import api from "../../api";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {useNotification} from "../../context/notificationContext"
import {Grid, Pagination, Stack, Typography} from "@mui/material";
import FilmCard from "../Cards/FilmCard";

function TrendingFilms() {
    useDocumentTitle("Trending films");

    const {showNotification} = useNotification();

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);


    useEffect( () => {
        api.get(`http://localhost:5001/api/films/home/get-trending-films/page/${page}`)
            .then(response => {
                setFilms(response.data.films);
                setTotalPages(response.data.totalPages);
            })
        .catch(error => showNotification(error.response.data, "error"));
    }, [page, showNotification]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    }

    return(
        <Stack spacing={7}>
            <Typography component="h1" variant="strong">Film in tendenza questa settimana</Typography>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

            <Grid container spacing={2}>
                { films?.map( film =>
                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <FilmCard film={film} />
                    </Grid>
                )}
            </Grid>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

        </Stack>
    )
}
export default TrendingFilms;