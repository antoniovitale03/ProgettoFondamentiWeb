import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./FilmCard";
import useDocumentTitle from "./useDocumentTitle";
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
                showNotification(error.response.data);
            }
        }
        fetchDirector();
    }, [directorName, directorID]);

    return(
        <div>
           <p>Info personali del regista</p>
            <h1>{director?.personalInfo?.name}</h1>
            <img src={director.personalInfo?.profile_image} alt="Immagine del direttore"/>
            {director.personalInfo?.birthday ? <p>Data di nascita: {director.personalInfo?.birthday}</p> : null}
            {director.personalInfo?.place_of_birth ? <p>Luogo di nascita: {director.personalInfo?.place_of_birth}</p> : null}
            <p>Biografia: {director.personalInfo?.biography}</p>

            <h1>Lista dei film in cui {director.personalInfo?.name} ha performato come attore ({director?.cast?.length})</h1>
            { director.cast?.map( (film) => <FilmCard key={film.id} film={film} /> )  }

            <h1>Lista dei film in cui {director.personalInfo?.name} ha svolto un ruolo tecnico ({director?.cast?.length})</h1>
            { director.crew?.map( (film) => <FilmCard key={film.id} film={film} /> ) }
        </div>

    )
}

export default DirectorPage;