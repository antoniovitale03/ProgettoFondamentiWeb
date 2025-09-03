import useDocumentTitle from "./useDocumentTitle";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useFilm} from "../context/filmContext"
import FilmCard from "./FilmCard";
import api from "../api";
import {useNotification} from "../context/notificationContext";
function ActorPage() {
    let { actorName } = useParams()
    let { actorID } = useParams()

    const [actorInfo, setActorInfo] = useState([])
    const {getActor} = useFilm()
    const {showNotification} = useNotification();

    //Effetto per trovare tutte le info dell'attore conoscendone l'id
    useEffect(() => {
        async function fetchActor(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/get-actor-info/${actorID}`)
                const actorInfo = response.data;
                setActorInfo(actorInfo);
            }catch(error){
                showNotification(error.response.message)
            }

        }
        fetchActor();
    }, [actorName, actorID, getActor]);



    useDocumentTitle(actorName.replaceAll("-", " "));
    return(
        <div>
            <p>Info personali dell'attore</p>
            <p>{actorInfo.personalInfo.name}</p>
            <img src={actorInfo.personalInfo.profile_image} alt="Immagine dell'attore"/>
            <p>Data di nascita: {actorInfo.personalInfo.birthday}</p>
            <p>Biografia: {actorInfo.personalInfo.biography}</p>

            <h1>Lista dei film in cui {actorInfo.personalInfo.name} ha performato come attore </h1>
            { actorInfo.cast.map( (film) => <FilmCard key={film} film={film} /> )  }

            <h1>Lista dei film in cui {actorInfo.personalInfo.name} ha svolto un ruolo tecnico </h1>
            { actorInfo.crew.map( (film) => <FilmCard key={film} film={film} /> ) }



        </div>

    )
}

export default ActorPage;