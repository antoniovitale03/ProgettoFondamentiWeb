import {React, useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import useDocumentTitle from "./hooks/useDocumentTitle";
import FilmCard from "./Cards/FilmCard";
import {Box, Button, Grid, Pagination, Stack} from "@mui/material";
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
        <Stack spacing={7} marginBottom={10}>
            <h1>Film usciti nel {year} </h1>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

            <Grid container spacing={2}>
                { films?.map( film =>
                    <Grid key={film._id} size={2}>
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
export default FilmsByYear;