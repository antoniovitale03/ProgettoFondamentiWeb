import CrewMemberCard from './Cards/CrewMemberCard'
import {useParams} from "react-router-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../api";

// /films/filmTitle/filmID/crew
function CrewPage(){
    const { filmTitle, filmID } = useParams();

    const [crew, setCrew] = useState([]);

    useDocumentTitle(`Crew di "${filmTitle}"`);

    useEffect( () => {
        const fetchCrew = async () => {
            const response = await api.get(`http://localhost:5001/api/films/get-crew/${filmID}`);
            let data = await response.data;
            setCrew(data);
        }
        fetchCrew();
    }, [filmTitle, filmID])

    return(
        <Box marginBottom={10}>
            <h1>Crew di "{filmTitle}" ({crew?.length} membri)</h1>
            <Grid container spacing={2} marginBottom={10}>
                {
                    crew?.map(crewMember =>
                        <Grid key={crewMember.id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                            <CrewMemberCard crewMember={crewMember} />
                        </Grid>
                    )}
            </Grid>
        </Box>

    )
}

export default CrewPage;