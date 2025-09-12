import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./useDocumentTitle";
import {Grid} from "@mui/material";
function DirectorPage() {
    let { directorName } = useParams();
    let { directorID } = useParams();
    const [director, setDirector] = useState([]);
    const {showNotification} = useNotification();
    useDocumentTitle(directorName.replaceAll("-", " "));

    useEffect(() => {
        async function fetchDirector() {
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-director-info/${directorID}`);
                const director = response.data;
                setDirector(director);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchDirector();
    }, [directorName, directorID]);

    return(
        <div>
            <h1>{director?.personalInfo?.name}</h1>
            <img src={director.personalInfo?.profile_image} alt="Immagine del direttore"/>
            {director.personalInfo?.birthday ? <p>Data di nascita: {director.personalInfo?.birthday}</p> : null}
            {director.personalInfo?.place_of_birth ? <p>Luogo di nascita: {director.personalInfo?.place_of_birth}</p> : null}
            <p>Biografia: {director.personalInfo?.biography}</p>


            {director?.cast?.length !== 0 ?
                <div>
                    <h1>Lista dei film in cui {director.personalInfo?.name} ha performato come attore/attrice ({director?.cast?.length})</h1>
                    <Grid container spacing={2}>
                        { director?.cast?.map((film) =>
                            <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} />
                            </Grid>)
                        }
                    </Grid>
                </div> : null
            }


            {director?.crew?.length !== 0 ?
                <div>
                    <h1>Lista dei film in cui {director.personalInfo?.name} ha svolto un ruolo tecnico ({director?.crew?.length})</h1>
                    <Grid container spacing={2}>
                        { director?.crew?.map((film) =>
                            <Grid item key={film._id} xs={12} sm={6} md={4} lg={3}>
                                <FilmCard film={film} />
                            </Grid>)
                        }
                    </Grid>
                </div> : null
            }
        </div>
    )
}

export default DirectorPage;