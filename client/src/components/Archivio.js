import useDocumentTitle from "./useDocumentTitle";
import {Box, FormControl, Grid, InputLabel, MenuItem, Pagination, Rating,Select, TextField, Typography} from "@mui/material";
import {React, useEffect, useState} from "react";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import FilmCard from "./Cards/FilmCard";

//funzione che crea l'array delle decadi
const generateDecadesArray = () => {
    const decades = [];
    const currentYear = new Date().getFullYear();
    const currentDecade = Math.floor(currentYear / 10) * 10;
    for(let decade = currentDecade; decade >= 1870; decade -= 10){
        decades.push(decade);
    }
    return decades;
}


function Archivio(){
    useDocumentTitle("Archivio");
    const {showNotification} = useNotification();

    const [currentPage, setCurrentPage] = useState(1); //i film vengono mostrati paginati
    const [totalPages, setTotalPages] = useState(0);

    const [genres, setGenres] = useState([]); // generi che vengono trovati solo al primo render del componente

    const [archiveFilms, setArchiveFilms] = useState([]);

    //variabile di stato per gestire i filtri
    const [filters, setFilters] = useState({
        page: currentPage,
        genre: '', // Valore per "Tutti i Generi"
        decade: '', // Valore per "Tutte le Decadi"
        minRating: 0,
        sortBy: '' // Valore di default per l'ordinamento
    });

    //effetto per calcolare l'array con i generi (+ id corrispondente) una sola volta
    useEffect(() => {
        const fetchGenres = async () => {
            try{
                const response = await api.get("http://localhost:5001/api/films/get-all-genres");
                setGenres(response.data);
            }catch(error){
                showNotification("Errore nel caricamento dei generi", "error");
            }
        }
        fetchGenres();
    }, [])

    //effetto che ricerca i film ogni volta che i filtri cambiano o viene cambia la pagina di ricerca dei film
    useEffect(() => {
        const fetchArchiveFilms = async () => {
            try{
                //costruisco i parametri di ricerca che vengono usati di default per mostrare i film al primo caricamento
                //della pagina
                const params = {
                    page: currentPage,
                    genre: filters.genre,
                    decade: filters.decade,
                    minRating: filters.minRating,
                    sortBy: filters.sortBy
                };

                const response = await api.post('http://localhost:5001/api/films/get-archive-films', { params });

                setArchiveFilms(response.data.films);
                setTotalPages(response.data.totalPages);

            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
                setArchiveFilms([]); // In caso di errore, svuota i risultati
                setTotalPages(0);
            }
        }
        fetchArchiveFilms();
    }, [filters, currentPage]);

    //Quando handleFilterChange viene chiamato, riceve il value del <MenuItem> selezionato, cioè l'ID (genre.id).
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
        setCurrentPage(1); // resetta la pagina quando un filtro cambia
    };

    const handleRatingChange = (event, rating) => {
        //modifico l'oggetto event per poterlo passare a handleFilterChange
        const modifiedEvent = {
            target: {
                name: "minRating",
                value: rating
            }
        };
        handleFilterChange(modifiedEvent);
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    return(
        <Box>
            <Typography variant="h4" component="h1">
                Esplora l'Archivio
            </Typography>

            <Pagination
                count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
            />

            <Box>
                {genres.length > 0 ?
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Genere</InputLabel>
                        <Select name="genre" value={filters.genre} label="Genere" onChange={(event, rating) => handleFilterChange(event, rating)} variant="standard">
                            {genres.map((genre, index) => (
                                <MenuItem key={index} value={genre.id}>{genre.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> : null
                }


                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Decade</InputLabel>
                    <Select name="decade" value={filters.decade} label="Decade" onChange={handleFilterChange} variant="standard">
                        {generateDecadesArray().map((decade, index) => (
                            <MenuItem key={index} value={decade}>{decade}s</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth : 180}}>
                    <Typography component="legend">Minimo Rating medio</Typography>
                    <Rating name="minRating" value={filters.minRating} onChange={handleRatingChange} precision={0.5} />
                </FormControl>

                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Ordina per</InputLabel>
                    <Select name="sortBy" value={filters.sortBy} label="Ordina per" onChange={handleFilterChange} variant="standard">
                        <MenuItem value="popularity.desc">Dal più popolare</MenuItem>
                        <MenuItem value="popularity.asc">Dal meno popolare</MenuItem>
                    </Select>
                </FormControl>



            </Box>
            {archiveFilms.length > 0 ?
                (
                    <>
                    <Grid container spacing={2}>
                        {archiveFilms.map((film, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} />
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>
                    </>
                ) : <p>Caricamento dei film...</p>

            }
        </Box>
    )
}

export default Archivio;