import {useLocation, useParams} from "react-router-dom";
import ActorCard from "./Cards/ActorCard"
import useDocumentTitle from "./useDocumentTitle";
import {Box, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";

// /films/filmTitle/filmID/cast
function CastPage(){
    const {filmTitle, filmID} = useParams();
    const [cast, setCast] = useState([]);


    useDocumentTitle(`Cast di "${filmTitle}"`);

    useEffect( () => {
        async function fetchCast(){
            const response = await api.get(`http://localhost:5001/api/films/get-cast/${filmID}`);
            let data = await response.data;
            setCast(data);
            console.log(data);
        }
        fetchCast();
    }, [])

    return(
        <Box>
            <h1>Cast di "{filmTitle}" ( {cast?.length} attori )</h1>
            <Grid container spacing={2}>
                {cast?.map((actor, index) =>
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <ActorCard actor={actor}/>
                    </Grid>
                )}
            </Grid>
        </Box>
        )
}

export default CastPage;