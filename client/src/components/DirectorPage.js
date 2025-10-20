import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Grid, Typography} from "@mui/material";
function DirectorPage() {
    let { directorName } = useParams();
    let { directorID } = useParams();

    const [directorPersonalInfo, setDirectorPersonalInfo] = useState([]);
    const [directorCast, setDirectorCast] = useState([]);
    const [directorCrew, setDirectorCrew] = useState([]);
    const {showNotification} = useNotification();


    useDocumentTitle(directorName.replaceAll("-", " "));

    useEffect(() => {
        async function fetchDirector() {
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-director-info/${directorID}`);
                const director = response.data;
                setDirectorPersonalInfo(director.personalInfo);
                setDirectorCast(director.cast);
                setDirectorCrew(director.crew);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchDirector();
    }, [directorName, directorID]);


    return(
        <Box>
            <Typography sx={{fontSize:{xs:"25px", md:"2.2vw"}, margin:"20px", fontWeight:"bold"}}>{directorPersonalInfo.name}</Typography>
            <Grid container spacing={1} alignItems="flex-start" >
                <Grid xs={12} sm={6} md={4} >
                    <img style={{height:"auto", maxWidth:"300px", margin:"20px"}} src={directorPersonalInfo.profile_image} alt="Immagine del direttore"/>
                </Grid>
                <Grid xs={12} sm={6} md={8} size={8}>
                    {directorPersonalInfo.birthday ? <p style={{fontSize:{xs:"15px", md:"2vw"}}}>Data di nascita: {directorPersonalInfo.birthday}</p> : null}
                    {directorPersonalInfo.place_of_birth ? <p style={{fontSize:{xs:"15px", md:"2vw"}}}>Luogo di nascita: {directorPersonalInfo.place_of_birth}</p> : null}
                    <p style ={{flexWrap:"wrap", fontSize:{xs:"15px", md:"2vw"}}}>Biografia: {directorPersonalInfo.biography}</p>
                </Grid>
            </Grid>



            {directorCast.length !== 0 ?
                <div>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {directorPersonalInfo.name} ha performato come attore/attrice ({directorCast.length})</Typography>
                    <Grid container spacing={2}>
                        { directorCast.map(film =>
                            <Grid key={film._id} size={2} xs={12} sm={6} md={4} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}} >
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>)
                        }
                    </Grid>
                </div>
                : <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>{directorPersonalInfo.name} non ha performato in nessun film come attore/attrice</Typography>
            }

            {directorCrew.length !== 0 ?
                <Box marginBottom={10}>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {directorPersonalInfo.name} ha svolto un ruolo tecnico ({directorCrew.length})</Typography>
                    <Grid container spacing={2}>
                        { directorCrew.map((film) =>
                            <Grid key={film._id} size={2} xs={12} sm={6} md={4} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}}>
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>)
                        }
                    </Grid>
                </Box> : null
            }
        </Box>
    )
}

export default DirectorPage;
