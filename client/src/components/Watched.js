import useDocumentTitle from "./hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {useAuth} from "../context/authContext";
import {useParams} from "react-router-dom";
import SearchFilters from "./SearchFilters";
import _ from "lodash"; //per la deep comparison
import GetParams from "./hooks/useGetSearchParams";

function Watched(){

    const {user} = useAuth();
    const {username} = useParams();
    const {showNotification} = useNotification();

    const [numWatched, setNumWatched] = useState([]);
    const [films, setFilms] = useState([]);

    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: "",
        isLiked: null
    });

    useDocumentTitle(`Film visti da ${username}`);

    const removeFromWatched = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${filmID}`);
            showNotification(<strong>{filmTitle} è stato rimosso dai tuoi <a href={`/${user.username}/watched`} style={{ color: 'green' }}>film visti</a></strong>, "success");
            setFilms(currentFilms => currentFilms.filter(film => film.id !== filmID));
            setNumWatched(num => num - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect(() => {
        if( _.isEqual(filters, {genre: "", decade: "", minRating: 0, sortByDate: "", sortByPopularity: "", isLiked: null})){
            api.get(`http://localhost:5001/api/films/watched/get-watched/${username}`)
                .then(response => {
                    setFilms(response.data);
                    setNumWatched(response.data.length);
                })
                .catch(error => showNotification(error.response.data, "error"));
        }else{
            const params = GetParams(filters);
            api.get(`http://localhost:5001/api/films/watched/get-watched/${username}?${params.toString()}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
        }
    }, [filters, username, showNotification]);


    return(
        <Box >
            { numWatched !== 0 ?
                <Stack spacing={7}>
                    { user.username === username ? <Typography component="h1" variant="strong">Hai visto {numWatched} film </Typography>
                        : <Typography component="h1" variant="strong">{username} ha visto {numWatched} film</Typography> }

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={true} />

                    <Typography component="p">{films.length} film trovati</Typography>

                    <Grid container spacing={2}>
                        { films.map(film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromWatched}/>
                            </Grid>
                        )
                        }
                    </Grid>

                </Stack> :
                <Box>
                    { user.username === username ?
                        <Typography component="h1" variant="strong">Non hai ancora visto nessun film</Typography> :
                        <Typography component="h1" variant="strong">{username} non ha ancora visto nessun film</Typography>
                    }
                </Box>
            }
        </Box>
    )
}

export default Watched;