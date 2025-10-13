import {useEffect, useState} from "react";
import api from "../../api";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {useNotification} from "../../context/notificationContext"
import {Grid, Pagination, Stack} from "@mui/material";
import FilmCard from "../Cards/FilmCard";
import SearchFilters from "../SearchFilters";

function CurrentPopularFilms() {
    useDocumentTitle("Film più popolari del momento");

    const {showNotification} = useNotification();

    const [films, setFilms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const [filters, setFilters] = useState({
        page: 1,
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: "",
    });


    useEffect( () => {
        const fetchCurrentPopularFilms = async () => {
            try{
                const params = new URLSearchParams();
                params.append("page", filters.page);
                if(filters.genre !== "") params.append("genre", filters.genre);
                if (filters.decade !== "") params.append("decade", filters.decade);
                if (filters.minRating !== 0) params.append("minRating", filters.minRating);
                if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
                if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);

                const response = await api.get(`http://localhost:5001/api/films/home/get-current-popular-films?${params.toString()}`);
                let data = await response.data;
                setFilms(data.films);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error");
            }
        }
        fetchCurrentPopularFilms();
    }, [filters, showNotification]);

    const handlePageChange = (event, value) => {
        setFilters({...filters, page: value});
        window.scrollTo(0, 0);
    }

    return(
        <Stack spacing={7}>
            <h1>Film popolari del momento</h1>

            <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

            {films.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }


            <p>{films.length * totalPages} film trovati</p>

            <Grid container spacing={2}>
                { films?.map( film =>
                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <FilmCard film={film} />
                    </Grid>
                )}
            </Grid>

            {films.length > 0 &&
                <Pagination
                    count={totalPages > 500 ? 500 : totalPages} // Limite di TMDB
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            }
        </Stack>
    )
}

export default CurrentPopularFilms;