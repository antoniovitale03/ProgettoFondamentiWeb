import useDocumentTitle from "./hooks/useDocumentTitle";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid, Stack} from "@mui/material";
function ActorPage() {
    let { actorName } = useParams();
    actorName = actorName.replaceAll("-", " ");

    let { actorID } = useParams();

    const [actor, setActor] = useState(null);
    const {showNotification} = useNotification();

    useDocumentTitle(actorName);

    useEffect(() => {
        async function fetchActor(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-actor-info/${actorID}`)
                const actor = response.data;
                setActor(actor);
            }catch(error){
                showNotification(error.response.data, "error")
            }
        }
        fetchActor();
    }, [actorName, actorID, showNotification]);

if(actor){
    return(
        <Stack spacing={7} marginBottom={10}>
            <h1>{actor.personalInfo.name}</h1>
            <img src={actor.personalInfo.profile_image} alt="Immagine dell'attore" style={{ width: '300px' }}/>
            <p>Data di nascita: {actor.personalInfo.birthday}</p>
            <p>Biografia: {actor.personalInfo.biography}</p>

            {
                actor.cast.length > 0 &&
                <Box>
                    <h1>Film in cui {actor.personalInfo.name} ha performato come attore/attrice ({actor.cast.length})</h1>

                    <Grid container spacing={2}>
                        {actor.cast.map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            }

            {
                actor.crew.length > 0 ?
                    <Box>
                        <h1>Film in cui {actor.personalInfo.name} ha svolto un ruolo tecnico ({actor.crew.length}) </h1>
                        <Grid container spacing={2}>
                            {actor.crew.map(film =>
                                <Grid key={film._id} size={2}>
                                    <FilmCard film={film} />
                                </Grid>
                            )}
                        </Grid>
                    </Box> : <p>{actor.personalInfo.name} non ha svolto in nessun film un ruolo tecnico</p>
            }
        </Stack>
    )
}

}

export default ActorPage;