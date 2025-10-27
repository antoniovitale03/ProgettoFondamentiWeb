import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {Grid, Pagination, Stack, Typography} from "@mui/material";
import {useNotification} from "../../context/notificationContext";
import FilmCard from "../Cards/FilmCard";
import api from "../../api";

function SimilarFilms(){

    const {showNotification} = useNotification();
    const {filmTitle, filmID} = useParams();
    useDocumentTitle(`Film simili a ${filmTitle}`);

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const [page, setPage] = useState(1);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append("filmID", filmID);
        params.append("page", page);
        api.get(`${process.env.REACT_APP_SERVER}/api/films/get-similar-films?${params.toString()}`)
            .then(response => response.data)
            .then(data => {
                setFilms(data.films);
                setTotalPages(data.totalPages);
            })
            .catch(() => showNotification("Errore nel caricamento dei film simili", "error"));
    }, [filmTitle, filmID, page, showNotification])

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    }

    return(
        <Stack spacing={7} marginBottom={10}>
            <Typography component="h1"> Film simili a "{filmTitle.replaceAll("-", " ")}" </Typography>

            {
                films.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }

            {
                films.length > 0 ?
                <Typography component="p">{films.length * totalPages} film trovati</Typography>:
                    <Typography component="p">Nessun film trovato</Typography>
            }


            {
                films.length > 0 &&
                <Grid container spacing={2}>
                    {films.map( film =>
                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <FilmCard film={film} />
                    </Grid>)}
                </Grid>

            }

            {
                films.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }
        </Stack>
    )
}

export default SimilarFilms;