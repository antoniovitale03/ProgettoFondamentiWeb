import {useEffect, useState} from "react";
import api from "../api";
import {useParams, useNavigate} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
import {useNotification} from "../context/notificationContext"
import {Box, Button, Grid} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FilmCard from "./Cards/FilmCard";

function NowPlayingFilms() {
    useDocumentTitle("Film attualmente al cinema");

    const {showNotification} = useNotification();
    let {pageNumber} = useParams()
    pageNumber = parseInt(pageNumber);
    const navigate = useNavigate()

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);


    useEffect( () => {
        async function fetchNowPlayingFilms() {
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-now-playing-films/page/${pageNumber}`);
                let data = response.data;
                setFilms(data.nowPlayingFilms);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }

        }
        fetchNowPlayingFilms();
    })

    const setPreviousPage = () => {
        navigate(`/films/now-playing-films/page/${pageNumber - 1}`)
    }

    const setNextPage = () => {
        navigate(`/films/now-playing-films/page/${pageNumber + 1}`)
    }

    return(
        <Box>
            <h1>Film attualmente al cinema</h1>

            <div style={{ textAlign: 'center' }}>
                <Button onClick={setPreviousPage} variant="contained" color="primary" disabled={pageNumber === 1}>
                    <KeyboardArrowLeftIcon />
                </Button>

                <Button onClick={setNextPage} variant="contained" color="primary" disabled={pageNumber >= totalPages}>
                    <KeyboardArrowRightIcon />
                </Button>
                <p>pagina {pageNumber}</p>
            </div>

            <Grid container spacing={7}>
                { films?.map( film =>
                    <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                        <FilmCard key={film._id} film={film} />
                    </Grid>
                )}
            </Grid>

            <div style={{ textAlign: 'center' }}>
                <Button onClick={setPreviousPage} variant="contained" color="primary" disabled={pageNumber === 1}>
                    <KeyboardArrowLeftIcon />
                </Button>

                <Button onClick={setNextPage} variant="contained" color="primary" disabled={pageNumber >= totalPages}>
                    <KeyboardArrowRightIcon />
                </Button>
                <p>pagina {pageNumber}</p>
            </div>

        </Box>
    )
}

export default NowPlayingFilms;