import {React, useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import useDocumentTitle from "./useDocumentTitle";
import FilmCard from "./Cards/FilmCard";
import {Box, Button, Grid, Pagination} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function FilmsByYear(){
    let {year} = useParams();
    useDocumentTitle(`Film usciti nel ${year}`);

    const {showNotification} = useNotification();

    const [currentPage, setCurrentPage] = useState(1);
    const [films, setFilms] = useState([]); // Per salvare l'elenco dei film
    const [totalPages, setTotalPages] = useState(0); // Per il numero totale di pagine

    //attivo l'effetto ogni volta che cambio pagina
    useEffect( () => {
        async function fetchFilmsByYear(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/${year}/page/${currentPage}`); //caricamento paginato dei film
                let data = response.data;
                setFilms(data.films);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }
        }
        fetchFilmsByYear();
    }, [currentPage]);


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    return(
        <Box>
            <h1>Film usciti nel {year} </h1>

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
export default FilmsByYear;