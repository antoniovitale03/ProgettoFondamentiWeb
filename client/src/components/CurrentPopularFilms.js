import {React, useEffect, useState} from "react";
import api from "../api";
import {useParams, useNavigate} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
import {useNotification} from "../context/notificationContext"
import {Box, Button, Grid, Pagination} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FilmCard from "./Cards/FilmCard";

function CurrentPopularFilms() {
    useDocumentTitle("Film più popolari del momento");

    const {showNotification} = useNotification();
    let {pageNumber} = useParams()
    pageNumber = parseInt(pageNumber);
    const navigate = useNavigate()

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect( () => {
        async function fetchCurrentPopularFilms() {
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-current-popular-films/page/${currentPage}`);
                let data = response.data;
                setFilms(data.currentPopularFilms);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }

        }
        fetchCurrentPopularFilms();
    }, [currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    }

    return(
        <Box>
            <h1>Film popolari del momento</h1>

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


        </Box>
    )
}

export default CurrentPopularFilms;