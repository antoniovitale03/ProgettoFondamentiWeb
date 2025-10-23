import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Grid, Typography} from "@mui/material";
function DirectorPage() {
    let { directorName, directorID } = useParams();

    const [director, setDirector] = useState(null);
    const {showNotification} = useNotification();

    useDocumentTitle(directorName.replaceAll("-", " "));

    useEffect(() => {
        api.get(`http://localhost:5001/api/films/get-director-info/${directorID}`)
            .then(response => setDirector(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [directorName, directorID, showNotification]);

if(director){
    return(
        <Box>
            <Typography sx={{fontSize:{xs:"25px", md:"2.2vw"}, margin:"20px", fontWeight:"bold"}}>{director.personalInfo.name}</Typography>
            <Grid container spacing={1} alignItems="flex-start" >
                <Grid xs={12} sm={6} md={4} >
                    <img style={{height:"auto", maxWidth:"300px", margin:"20px"}} src={director.personalInfo.profile_image} alt="Immagine del direttore"/>
                </Grid>
                <Grid xs={12} sm={6} md={8} size={8}>
                    {director.personalInfo.birthday && <Typography component="p" style={{fontSize:{xs:"15px", md:"2vw"}}}>Data di nascita: {director.personalInfo.birthday}</Typography> }
                    {director.personalInfo.place_of_birth && <Typography component="p" style={{fontSize:{xs:"15px", md:"2vw"}}}>Luogo di nascita: {director.personalInfo.place_of_birth}</Typography> }
                    <Typography component="p" style ={{flexWrap:"wrap", fontSize:{xs:"15px", md:"2vw"}}}>Biografia: {director.personalInfo.biography}</Typography>
                </Grid>
            </Grid>


            {director.cast.length !== 0 ?
                <Box>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {director.personalInfo.name} ha performato come attore/attrice ({director.cast.length})</Typography>
                    <Grid container spacing={2}>
                        { director.cast.map(film =>
                            <Grid key={film._id} size={2} xs={12} sm={6} md={4} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}} >
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>)
                        }
                    </Grid>
                </Box>
                : <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>{director.personalInfo.name} non ha performato in nessun film come attore/attrice</Typography>
            }

            {director.crew.length !== 0 &&
                <Box marginBottom={10}>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {director.personalInfo.name} ha svolto un ruolo tecnico ({director.crew.length})</Typography>
                    <Grid container spacing={2}>
                        { director.crew.map((film) =>
                            <Grid key={film._id} size={2} xs={12} sm={6} md={4} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}}>
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>)
                        }
                    </Grid>
                </Box>
            }
        </Box>
    )
}
}

export default DirectorPage;
