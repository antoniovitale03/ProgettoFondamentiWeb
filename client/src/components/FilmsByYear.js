import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import useDocumentTitle from "./useDocumentTitle";
import FilmCard from "./Cards/FilmCard";
import {Button, Grid} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function FilmsByYear(){
    let {year, page} = useParams();
    page = parseInt(page);
    useDocumentTitle(`Film usciti nel ${year}`);

    const {showNotification} = useNotification();
    const navigate = useNavigate();

    const [films, setFilms] = useState([]); // Per salvare l'elenco dei film
    const [totalPages, setTotalPages] = useState(0); // Per il numero totale di pagine

    useEffect( () => {
        async function fetchFilmsByYear(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/${year}/page/${page}`); //caricamento paginato dei film
                let data = response.data;
                setFilms(data.films);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }
        }
        fetchFilmsByYear();
    });

    const setNextPage = () => {
        navigate(`/films/${year}/page/${page + 1}`);
    };

    const setPreviousPage = () => {
        navigate(`/films/${year}/page/${page - 1}`);
    };

    return(
        <div>
            <h1>Sono usciti {films?.length * totalPages} film nel {year} </h1>

            <div style={{ textAlign: 'center' }}>
                <Button onClick={setPreviousPage} variant="contained" color="primary" disabled={page === 1}>
                    <KeyboardArrowLeftIcon />
                </Button>

                <Button onClick={setNextPage} variant="contained" color="primary" disabled={page >= totalPages}>
                    <KeyboardArrowRightIcon />
                </Button>
                <p>pagina {page} di {totalPages}</p>
            </div>

            <Grid container spacing={7}>
                { films?.map( film =>
                    <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                    <FilmCard key={film._id} film={film} />
                    </Grid>
                )}
            </Grid>
            <div style={{ textAlign: 'center' }}>
                <Button onClick={setPreviousPage} variant="contained" color="primary" disabled={page === 1}>
                    <KeyboardArrowLeftIcon />
                </Button>

                <Button onClick={setNextPage} variant="contained" color="primary" disabled={page >= totalPages}>
                    <KeyboardArrowRightIcon />
                </Button>
                <p>pagina {page} di {totalPages}</p>
            </div>

        </div>
    )
}
export default FilmsByYear;