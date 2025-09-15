import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Grid} from "@mui/material";
function ListaFilm(){
    useDocumentTitle("Lista film")

    const {showNotification} = useNotification();
    const [watchedFilms, setWatchedFilms] = useState([]);

    useEffect(()=>{
        async function getWatchedFilms(){
            try{
                const response = await api.get('http://localhost:5001/api/films/watched/get-watched')
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms);
            }catch(error){
                showNotification(error.response.data, "error");
            }

        }
        getWatchedFilms();
    }, [])


    return(
        <div>
            {watchedFilms.length === 0 ? <p>Non hai ancora visto nessun film</p>:
                <div>
                    <h1>Hai visto {watchedFilms.length} film</h1>
                    <Grid container spacing={2}>
                        { [...watchedFilms].reverse().map((film) =>
                            <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard key={film._id} film={film}/>
                            </Grid>)
                        }
                    </Grid>
                </div>
            }
        </div>
    )
}

export default ListaFilm;