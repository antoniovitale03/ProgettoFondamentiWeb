import CrewMemberCard from './Cards/CrewMemberCard'
import {useParams} from "react-router-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Grid, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";

// /films/filmTitle/filmID/crew
export default function CrewPage(){
    const { filmTitle, filmID } = useParams();

    const [crew, setCrew] = useState([]);

    useDocumentTitle(`Crew di "${filmTitle}"`);
    const {showNotification} = useNotification();

    useEffect( () => {
        api.get(`${process.env.REACT_APP_SERVER}/api/films/get-crew/${filmID}`)
            .then(response => setCrew(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [filmTitle, filmID, showNotification])

    return(
        <Stack spacing={7}>
            <Typography component="h1" variant="strong">Crew di "{filmTitle}" ({crew?.length} membri)</Typography>
            <Grid container spacing={2} marginBottom={10}>
                {
                    crew?.map(crewMember =>
                        <Grid key={crewMember.id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                            <CrewMemberCard crewMember={crewMember} />
                        </Grid>
                    )}
            </Grid>
        </Stack>

    )
}