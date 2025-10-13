import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, Grid, Stack} from "@mui/material";

function DirectorPage() {

    let { directorName, directorID } = useParams();

    const [director, setDirector] = useState(null);
    const {showNotification} = useNotification();


    useDocumentTitle(directorName.replaceAll("-", " "));

    useEffect(() => {
        const fetchDirector = async () => {
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-director-info/${directorID}`);
                const director = response.data;
                setDirector(director);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchDirector();
    }, [directorName, directorID, showNotification]);

    if(director){
        return(
            <Stack spacing={7} marginBottom={10}>

                <h1>{director.personalInfo.name}</h1>
                <img src={director.personalInfo.profile_image} alt="Immagine del direttore" style={{ width: '300px' }}/>
                {director.personalInfo.birthday && <p>Data di nascita: {director.personalInfo.birthday}</p> }
                {director.personalInfo.place_of_birth && <p>Luogo di nascita: {director.personalInfo.place_of_birth}</p> }
                <p>Biografia: {director.personalInfo.biography}</p>


                {director.cast.length > 0 ?
                    <div>
                        <h1>Lista dei film in cui {director.personalInfo.name} ha performato come attore/attrice ({director.cast.length})</h1>
                        <Grid container spacing={2}>
                            { director.cast.map(film =>
                                <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                    <FilmCard film={film} />
                                </Grid>)
                            }
                        </Grid>
                    </div>
                    : <p>{director.personalInfo.name} non ha performato in nessun film come attore/attrice</p>
                }

                {director.crew.length > 0 &&
                    <Box marginBottom={10}>
                        <h1>Lista dei film in cui {director.personalInfo.name} ha svolto un ruolo tecnico ({director.crew.length})</h1>
                        <Grid container spacing={2}>
                            {
                                director.crew.map((film) =>
                                <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                    <FilmCard film={film} />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                }
            </Stack>
        )
    }
}

export default DirectorPage;