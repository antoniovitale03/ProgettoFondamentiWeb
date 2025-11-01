import useDocumentTitle from "./hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import _ from "lodash";
import SearchFilters from "./SearchFilters";
import GetParams from "./hooks/useGetSearchParams"
import {Link} from "react-router-dom";

export default function Watchlist(){

    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Watchlist di ${username}`);
    const {showNotification} = useNotification();
    const [films, setFilms] = useState([]);
    const [numWatchlist, setNumWatchlist] = useState(0);

    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: "",
    });

    const removeFromWatchlist = async (filmID, filmTitle) => {
        try{
            await api.delete(`${process.env.REACT_APP_SERVER}/api/films/watchlist/remove-from-watchlist/${filmID}`);
            showNotification(<strong>"{filmTitle}" è stato rimosso dalla tua <Link to={`/${user.username}/watchlist`} style={{ color: 'green' }}>watchlist</Link></strong>, "success");
            setFilms(currentFilms => currentFilms.filter(film => film.id !== filmID));
            setNumWatchlist(num => num - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect(() => {
        if( _.isEqual(filters, {genre: "", decade: "", minRating: 0, sortByDate: "", sortByPopularity: ""})){
            api.get(`${process.env.REACT_APP_SERVER}/api/films/watchlist/get-watchlist/${username}`)
            .then(response => {
                setFilms(response.data);
                setNumWatchlist(response.data.length);
            })
            .catch(error => showNotification(error.response.data, "error"));
        }else{
            const params = GetParams(filters);
            api.get(`${process.env.REACT_APP_SERVER}/api/films/watchlist/get-watchlist/${username}?${params.toString()}`)
            .then(response => setFilms(response.data))
            .catch(error => showNotification(error.response.data, "error"));
        }
    }, [username, filters, showNotification])



    return(
        <Box>
            { numWatchlist !== 0 ?
                <Stack spacing={7}>
                    { user.username === username ?
                        <Typography component="h1" variant="strong">Vuoi guardare {numWatchlist} film </Typography>
                        : <Typography component="h1" variant="strong">{username} vuole guardare {numWatchlist} film</Typography>
                    }

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false}/>

                    <Typography component="p">{films.length} film trovati</Typography>

                    <Grid container spacing={2}>
                        { films?.map(film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromWatchlist}/>
                            </Grid>)
                        }
                    </Grid>
                </Stack> :
                <Box>
                    { user.username === username ?
                        <Typography component="h1" variant="strong">La tua watchlist è vuota. Aggiungi qualche film!</Typography> :
                        <Typography component="h1" variant="strong">{username} non ha ancora aggiunto nessun film alla watchlist</Typography>
                    }
                </Box>
            }
        </Box>
    )
}