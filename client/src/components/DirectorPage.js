import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Grid} from "@mui/material";
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
            <h1>{directorPersonalInfo.name}</h1>
            <img src={directorPersonalInfo.profile_image} alt="Immagine del direttore"/>
            {directorPersonalInfo.birthday ? <p>Data di nascita: {directorPersonalInfo.birthday}</p> : null}
            {directorPersonalInfo.place_of_birth ? <p>Luogo di nascita: {directorPersonalInfo.place_of_birth}</p> : null}
            <p>Biografia: {directorPersonalInfo.biography}</p>


            {directorCast.length !== 0 ?
                <div>
                    <h1>Lista dei film in cui {directorPersonalInfo.name} ha performato come attore/attrice ({directorCast.length})</h1>
                    <Grid container spacing={2}>
                        { directorCast.map(film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} />
                            </Grid>)
                        }
                    </Grid>
                </div>
                : <p>{directorPersonalInfo.name} non ha performato in nessun film come attore/attrice</p>
            }

            {directorCrew.length !== 0 ?
                <Box marginBottom={10}>
                    <h1>Lista dei film in cui {directorPersonalInfo.name} ha svolto un ruolo tecnico ({directorCrew.length})</h1>
                    <Grid container spacing={2}>
                        { directorCrew.map((film) =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} />
                            </Grid>)
                        }
                    </Grid>
                </Box> : null
            }
        </Box>
    )
}

export default DirectorPage;