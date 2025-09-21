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

    const [actorInfo, setActorInfo] = useState([])
    const {showNotification} = useNotification();

    //Effetto per trovare tutte le info dell'attore conoscendone l'id
    useEffect(() => {
        async function fetchActor(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-actor-info/${actorID}`)
                const actorInfo = response.data;
                setActorInfo(actorInfo);
            }catch(error){
                showNotification(error.response.message, "error")
            }

        }
        fetchActor();
    }, [actorName, actorID]);



    useDocumentTitle(actorName);
    return(
        <Box>
            <p>Info personali dell'attore</p>
            <h1>{actorInfo.personalInfo?.name}</h1>
            <img src={actorInfo.personalInfo?.profile_image} alt="Immagine dell'attore"/>
            <p>Data di nascita: {actorInfo.personalInfo?.birthday}</p>
            <p>Biografia: {actorInfo.personalInfo?.biography}</p>

            {actorInfo?.cast?.length !== 0 ?
                <div>
                <h1>Lista dei film in cui {actorInfo?.personalInfo?.name} ha performato come attore/attrice ({actorInfo?.cast?.length})</h1>

                <Grid container spacing={7}>
                    {actorInfo.cast?.map((film, index) =>
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <FilmCard film={film} />
                        </Grid>
                    )}
                </Grid>
                </div>: null
            }

            {actorInfo?.crew?.length !== 0 ?
                <Box>
                    <h1>Lista dei film in cui {actorInfo.personalInfo?.name} ha svolto un ruolo tecnico ({actorInfo?.crew?.length}) </h1>
                    <Grid container spacing={7}>
                        {actorInfo.crew?.map((film, index) =>
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box>: null
            }
        </Box>

    )
}

export default ActorPage;