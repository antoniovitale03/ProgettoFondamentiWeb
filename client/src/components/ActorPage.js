import useDocumentTitle from "./useDocumentTitle";
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
            <Typography sx={{fontSize:{xs:"25px", md:"2.2vw"}, margin:"20px", fontWeight:"bold"}}>{actorPersonalInfo.name}</Typography>
            <Grid container spacing={1} alignItems="flex-start">
                <Grid xs={12} sm={6} md={4}>
                    <img style={{height:"auto", maxWidth:"300px", margin:"20px"}} src={actorPersonalInfo.profile_image} alt="Immagine dell'attore"/>
                </Grid>
                <Grid xs={12} sm={6} md={8} size={8}>
                    <p style={{fontSize:{xs:"15px", md:"1,5vw"}}}> Data di nascita: {actorPersonalInfo.birthday}</p>
                    <p style ={{flexWrap:"wrap", fontSize:{xs:"15px", md:"1,5vw"}}}>Biografia: {actorPersonalInfo.biography}</p>
                </Grid>
            </Grid>

            {actorCast.length !== 0 ?
                <div>
                <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {actorPersonalInfo.name} ha performato come attore/attrice ({actorCast.length})</Typography>

                <Grid container spacing={2}>
                    {actorCast.map(film =>
                        <Grid key={film._id} xs={12} sm={6} md={4} size={2}>
                            <FilmCard film={film}/>
                        </Grid>
                    )}
                </Grid>
                </div>: null
            }

            {actorCrew.length !== 0 ?
                <Box>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}} >Lista dei film in cui {actorPersonalInfo.name} ha svolto un ruolo tecnico ({actorCrew.length}) </Typography>
                    <Grid container spacing={2}>
                        {actorCrew.map(film =>
                            <Grid key={film._id} xs={12} sm={6} md={4} size={2} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}}>
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>
                        )}
                    </Grid>
                </Box> : <Typography sx={{fontSize:{xs:"15px", md:"1,5vw"}, margin:"20px", fontWeight:"bold"}}>{actorPersonalInfo.name} non ha svolto in nessun film un ruolo tecnico</Typography>
            }



        </Box>

    )
}

export default ActorPage;