import {useParams} from "react-router-dom";
import ActorCard from "./Cards/ActorCard"
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Grid, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";

// /films/filmTitle/filmID/cast
function CastPage(){
    const {filmTitle, filmID} = useParams();
    const [cast, setCast] = useState([]);
    const {showNotification} = useNotification();


    useDocumentTitle(`Cast di "${filmTitle}"`);

    useEffect( () => {
        api.get(`http://localhost:5001/api/films/get-cast/${filmID}`)
            .then((response) => setCast(response.data))
            .catch((error) => showNotification(error.response.data, "error"));
    }, [filmTitle, filmID]);

    return(
        <Stack spacing={7} marginBottom={10}>
            <h1>Cast di "{filmTitle}" ( {cast?.length} attori )</h1>
            <Grid container spacing={2}>
                {
                    cast?.map(actor =>
                    <Grid key={actor.id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <ActorCard actor={actor}/>
                    </Grid>
                )}
            </Grid>
        </Stack>
        )
}

export default CastPage;