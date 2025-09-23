import useDocumentTitle from "./useDocumentTitle";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Rating,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
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
    const [genre, setGenre] = useState("");
    const [decade, setDecade] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    const [genres, setGenres] = useState([]); // generi che vengono trovati solo al primo render del componente

    const [archiveFilms, setArchiveFilms] = useState([]);

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
                    genre: genre,
                    decade: decade,
                    minRating: minRating,
                    sortBy: sortBy
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
    }, [currentPage, genre, decade, minRating, sortBy]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    return(
        <Stack spacing={3}>
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

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                {
                    genres.length > 0 ?
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Genere</InputLabel>
                        <Select value={genre} label="Genere" variant="standard" onChange={(event) => {
                            setGenre(event.target.value);
                            setCurrentPage(1);}}>
                            {genres.map((genre, index) => (
                                <MenuItem key={index} value={genre.id}>{genre.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    : null
                }

                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Decade</InputLabel>
                    <Select name="decade" value={decade} label="Decade" variant="standard" onChange={(event) =>
                    {setDecade(event.target.value);
                    setCurrentPage(1);}} >
                        {generateDecadesArray().map((decade, index) => (
                            <MenuItem key={index} value={decade}>{decade}s</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth : 180}}>
                    <Typography component="legend">Minimo Rating medio</Typography>
                    <Rating name="minRating" value={minRating} onChange={(event) =>
                        {setMinRating(event.target.value);
                        setCurrentPage(1);}} precision={0.5} />
                </FormControl>

                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Ordina per</InputLabel>
                    <Select name="sortBy" value={sortBy} label="Ordina per" variant="standard" onChange={(event) =>
                    {setSortBy(event.target.value);
                    setCurrentPage(1);}} >
                        <MenuItem value="popularity.desc">Dal più popolare</MenuItem>
                        <MenuItem value="popularity.asc">Dal meno popolare</MenuItem>
                    </Select>
                </FormControl>

            </Box>
            {archiveFilms.length > 0 ?
                    <Box>
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
                    </Box>
                : <p>Caricamento dei film...</p>
            }
        </Stack>
    )
}

export default Archivio;