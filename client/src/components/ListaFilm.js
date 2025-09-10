import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import {useFilm, useFilms} from "../context/filmContext"
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Grid} from "@mui/material";
function ListaFilm(){
    useDocumentTitle("Lista film")

    const {showNotification} = useNotification();
    const [watchedFilms, setWatchedFilms] = useState([]);
    const {getWatched} = useFilm()

    useEffect(()=>{
        async function getWatchedFilms(){
            try{
                const response = await api.get('http://localhost:5001/api/films/get-watched')
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms);
            }catch(error){
                showNotification(error.response.data, "error");
            }

        }
        getWatchedFilms();
    }, [getWatched])


    return(
        <div>
            <h1>Hai visto {watchedFilms.length} film</h1>
            <Grid container spacing={7}>
                { [...watchedFilms].reverse().map((film) =>
                    <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                        <FilmCard key={film._id} film={film}/>
                    </Grid>)
                }
            </Grid>
        </div>
    )
}

export default ListaFilm;