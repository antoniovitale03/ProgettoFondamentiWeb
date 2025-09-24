import useDocumentTitle from "./useDocumentTitle";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid} from "@mui/material";
function ActorPage() {
    let { actorName } = useParams();
    actorName = actorName.replaceAll("-", " ");

    let { actorID } = useParams();

    const [actorPersonalInfo, setActorPersonalInfo] = useState([]);
    const [actorCast, setActorCast] = useState([]);
    const [actorCrew, setActorCrew] = useState([]);
    const {showNotification} = useNotification();

    useDocumentTitle(actorName);

    //Effetto per trovare tutte le info dell'attore conoscendone l'id
    useEffect(() => {
        async function fetchActor(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-actor-info/${actorID}`)
                const actor = response.data;
                setActorPersonalInfo(actor.personalInfo);
                setActorCast(actor.cast);
                setActorCrew(actor.crew);
            }catch(error){
                showNotification(error.response.message, "error")
            }

        }
        fetchActor();
    }, [actorName, actorID]);


    return(
        <Box>
            <p>Info personali dell'attore</p>
            <h1>{actorPersonalInfo.name}</h1>
            <img src={actorPersonalInfo.profile_image} alt="Immagine dell'attore"/>
            <p>Data di nascita: {actorPersonalInfo.birthday}</p>
            <p>Biografia: {actorPersonalInfo.biography}</p>

            {actorCast.length !== 0 ?
                <div>
                <h1>Lista dei film in cui {actorPersonalInfo.name} ha performato come attore/attrice ({actorCast.length})</h1>

                <Grid container spacing={2}>
                    {actorCast.map(film =>
                        <Grid key={film._id} size={2}>
                            <FilmCard film={film} />
                        </Grid>
                    )}
                </Grid>
                </div>: null
            }

            {actorCrew.length !== 0 ?
                <Box>
                    <h1>Lista dei film in cui {actorPersonalInfo.name} ha svolto un ruolo tecnico ({actorCrew.length}) </h1>
                    <Grid container spacing={2}>
                        {actorCrew.map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box> : <p>{actorPersonalInfo.name} non ha svolto in nessun film un ruolo tecnico</p>
            }



        </Box>

    )
}

export default ActorPage;