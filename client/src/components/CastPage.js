import {useParams} from "react-router-dom";
import ActorCard from "./Cards/ActorCard"
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Grid, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";

// /films/filmTitle/filmID/cast
function CastPage(){
    const {filmTitle, filmID} = useParams();
    const [cast, setCast] = useState([]);


    useDocumentTitle(`Cast di "${filmTitle}"`);

    useEffect( () => {
        const fetchCast = async () => {
            const response = await api.get(`http://localhost:5001/api/films/get-cast/${filmID}`);
            let data = await response.data;
            setCast(data);
        }
        fetchCast();
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