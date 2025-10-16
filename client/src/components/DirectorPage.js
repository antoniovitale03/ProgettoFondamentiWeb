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

    const [director, setDirector] = useState(null);
    const {showNotification} = useNotification();


    useDocumentTitle(directorName.replaceAll("-", " "));

    useEffect(() => {
        api.get(`http://localhost:5001/api/films/get-director-info/${directorID}`)
            .then(response => setDirector(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [directorName, directorID]);

if(director){
    return(
        <Box>
            <Typography sx={{fontSize:{xs:"25px", md:"2.2vw"}, margin:"20px", fontWeight:"bold"}}>{director.personalInfo.name}</Typography>
            <Grid container spacing={1} alignItems="flex-start" >
                <Grid size={{ xs:12, sm:6, md:4 }} >
                    <img style={{height:"auto", maxWidth:"300px", margin:"20px"}} src={director.personalInfo.profile_image} alt="Immagine del direttore"/>
                </Grid>
                <Grid size={{ xs:12, sm:6, md:8 }}>
                    {director.personalInfo.birthday && <p style={{fontSize: "clamp(15px,1vw,20px)"}}>Data di nascita: {director.personalInfo.birthday}</p> }
                    {director.personalInfo.place_of_birth && <p style={{fontSize: "clamp(15px,1vw,20px)"}}>Luogo di nascita: {director.personalInfo.place_of_birth}</p>}
                    <p style ={{flexWrap:"wrap", fontSize:"clamp(15px,1vw,20px)"}}>Biografia: {director.personalInfo.biography}</p>
                </Grid>
            </Grid>



            {director.cast.length !== 0 ?
                <div>
                    <h1>Lista dei film in cui {director.personalInfo.name} ha performato come attore/attrice ({director.cast.length})</h1>
                    <Grid container spacing={2}>
                        { director.cast.map(film =>
                            <Grid key={film._id} size={{ xs:12, sm:6, md:4 }} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}} >
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>)
                        }
                    </Grid>
                </div>
                : <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>{director.personalInfo.name} non ha performato in nessun film come attore/attrice</Typography>
            }

            {director.crew.length !== 0 &&
                <Box marginBottom={10}>
                    <Typography sx={{fontSize:{xs:"15px", md:"2vw"}, margin:"20px", fontWeight:"bold"}}>Lista dei film in cui {director.personalInfo.name} ha svolto un ruolo tecnico ({director.crew.length})</Typography>
                    <Grid container spacing={2}>
                        { director.crew.map((film) =>
                            <Grid key={film._id} size={{ xs:12, sm:6, md:4 }} sx={{display:"flex",flexDirection:"column",alignSelf:"stretch"}}>
                                <FilmCard film={film} sx={{height:"100%"}} />
                            </Grid>)
                        }
                    </Grid>
                </Box>
            }
        </Box>
    )}
}

export default DirectorPage;