import {useParams} from "react-router-dom";
import {React, useEffect, useState} from "react";
import useDocumentTitle from "./useDocumentTitle";
import {Box, Grid, Pagination} from "@mui/material";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";

function SimilarFilms(){

    const {showNotification} = useNotification();
    const {filmTitle, filmID} = useParams();
    useDocumentTitle(`Film simili a ${filmTitle}`);

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchSimilarFilms(){
            try{
                const response = await fetch(`http://localhost:5001/api/films/get-similar/${filmID}/${currentPage}`);
                const data = await response.json();
                setFilms(data.results);
                setTotalPages(data.total_pages)
            }catch(error){
                showNotification("Errore nel caricamento dei film simili", "error");
            }

        }
        fetchSimilarFilms();
    }, [currentPage])

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    }

    return(
        <Box>
            <h1>
                Film simili a "{filmTitle.replaceAll("-", " ")}"
            </h1>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

            <Grid container spacing={7}>
                { films?.map( film =>
                    <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                        <FilmCard key={film._id} film={film} />
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


        </Box>
    )
}

export default SimilarFilms;