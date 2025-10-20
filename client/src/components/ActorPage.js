import useDocumentTitle from "./hooks/useDocumentTitle";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import FilmCard from "./Cards/FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {Box, Grid, Typography} from "@mui/material";
function ActorPage() {
    let { actorName } = useParams();
    actorName = actorName.replaceAll("-", " ");

    let { actorID } = useParams();

    const [actor, setActor] = useState(null);
    const {showNotification} = useNotification();

    useDocumentTitle(actorName);

    //Effetto per trovare tutte le info dell'attore conoscendone l'id
    useEffect(() => {
        api.get(`http://localhost:5001/api/films/get-actor-info/${actorID}`)
            .then((response) => setActor(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [actorName, actorID]);

if (actor){
    return(
        <Box>
            <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>{actor.personalInfo.name}</Typography>
            <Grid container spacing={1} alignItems="flex-start">
                <Grid xs={12} sm={6} md={4}>
                    <img style={{height:"auto", maxWidth:"300px", margin:"20px"}} src={actor.personalInfo.profile_image} alt="Immagine dell'attore"/>
                </Grid>
                <Grid xs={12} sm={6} md={8} size={8}>
                    <Typography component="p" sx={{fontSize:{xs:"15px", md:"1,5vw"}}}> Data di nascita: {actor.personalInfo.birthday}</Typography>
                    <Typography component="p" sx={{flexWrap:"wrap", fontSize:{xs:"15px", md:"1,5vw"}}}>Biografia: {actor.personalInfo.biography}</Typography>
                </Grid>
            </Grid>

            {actor.cast.length > 0 &&
                <Box>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {actor.personalInfo.name} ha performato come attore/attrice ({actor.cast.length})</Typography>

                    <Grid container spacing={2}>
                        {actor.cast.map(film =>
                            <Grid key={film._id}size={2} xs={12} sm={6} md={4} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}}>
                                <FilmCard film={film}/>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            }

            {actor.crew.length !== 0 ?
                <Box>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}} >Lista dei film in cui {actor.personalInfo.name} ha svolto un ruolo tecnico ({actor.crew.length}) </Typography>
                    <Grid container spacing={2}>
                        {actor.crew.map(film =>
                            <Grid key={film._id} size={2} xs={12} sm={6} md={4} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}}>
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>
                        )}
                    </Grid>
                </Box> : <Typography sx={{fontSize:{xs:"15px", md:"1,5vw"}, margin:"20px", fontWeight:"bold"}}>{actor.personalInfo.name} non ha svolto in nessun film un ruolo tecnico</Typography>
            }
        </Box>

    )}
}

export default ActorPage;