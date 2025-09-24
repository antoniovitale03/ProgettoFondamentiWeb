import {useEffect, useState} from "react";
import api from "../../api";
import useDocumentTitle from "../useDocumentTitle";
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
        async function fetchUpComingFilms() {
            try{
                const response = await api.get(`http://localhost:5001/api/films/home/get-upcoming-films/page/${currentPage}`);
                let data = response.data;
                setFilms(data.results);
                setTotalPages(data.total_pages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }
        }
        fetchUpComingFilms();
    }, [currentPage]);

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

export default UpcomingFilms;