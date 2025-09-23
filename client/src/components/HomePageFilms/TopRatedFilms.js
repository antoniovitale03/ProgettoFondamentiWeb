import {React, useEffect, useState} from "react";
import api from "../../api";
import useDocumentTitle from "../useDocumentTitle";
import {useNotification} from "../../context/notificationContext"
import {Grid, Pagination, Stack} from "@mui/material";
import FilmCard from "../Cards/FilmCard";

function TopRatedFilms() {
    useDocumentTitle("Film più acclamati");

    const {showNotification} = useNotification();

    const [currentPage, setCurrentPage] = useState(1);
    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);


    useEffect( () => {
        async function fetchTopRatedFilms() {
            try{
                const response = await api.get(`http://localhost:5001/api/films/home/get-top-rated-films/page/${currentPage}`);
                let data = response.data;
                setFilms(data.results);
                setTotalPages(data.total_pages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }

        }
        fetchTopRatedFilms();
    }, [currentPage])


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };


    return(
        <Stack spacing={3}>
            <h1>Film più acclamati</h1>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

            <Grid container spacing={7}>
                { films?.map( (film, index) =>
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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

export default TopRatedFilms;