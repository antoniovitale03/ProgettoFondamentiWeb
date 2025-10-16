import {useEffect, useState} from "react";
import api from "../../api";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {useNotification} from "../../context/notificationContext"
import {Grid, Pagination, Stack} from "@mui/material";
import FilmCard from "../Cards/FilmCard";

function UpcomingFilms() {
    useDocumentTitle("Film in uscita in Italia");

    const {showNotification} = useNotification();

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect( () => {
        api.get(`http://localhost:5001/api/films/home/get-upcoming-films/page/${currentPage}`)
            .then(response => {
                setFilms(response.data.results);
                setTotalPages(response.data.total_pages);
            })
        .catch(error => showNotification(error.response.data, "error"));
    }, [currentPage, showNotification]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };


    return(
        <Stack spacing={7}>
            <h1>Film in uscita in Italia</h1>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={currentPage}
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
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

        </Stack>
    )
}

export default UpcomingFilms;