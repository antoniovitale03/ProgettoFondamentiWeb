import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import useDocumentTitle from "./useDocumentTitle";
import FilmCard from "./FilmCard";
import {Button} from "@mui/material";

function FilmsByYear(){
    let {year, page} = useParams();
    page = parseInt(page);
    useDocumentTitle(`Film usciti nel ${year}`);

    const {showNotification} = useNotification();
    const navigate = useNavigate();

    const [films, setFilms] = useState([]); // Per salvare l'elenco dei film
    const [totalPages, setTotalPages] = useState(0); // Per il numero totale di pagine

    useEffect( () => {
        async function fetchFilmsByYear(){
            try{
                const response = await api.get(`http://localhost:5001/api/films/${year}/page/${page}`); //caricamento paginato dei film
                let data = response.data;
                setFilms(data.films);
                setTotalPages(data.totalPages);
            }catch(error){
                showNotification("Errore nel caricamento dei film", "error")
            }

        }
        fetchFilmsByYear();
    });

    const setNextPage = () => {
        navigate(`/films/${year}/page/${page + 1}`);
    };

    const setPreviousPage = () => {
        navigate(`/films/${year}/page/${page - 1}`);
    };

    return(
        <div>
            <h1>Sono usciti {films?.length * totalPages} film nel {year} </h1>
            <div>
                { films.map(film => <FilmCard key={film._id} film={film}/> ) }
            </div>

            <Button onClick={setPreviousPage} variant="contained" color="primary" disabled={page === 1}>
                Pagina precedente
            </Button>

            <Button onClick={setNextPage} variant="contained" color="primary" disabled={page >= totalPages}>
                Pagina successiva
            </Button>
            <p>pagina {page} di {totalPages}</p>
        </div>
    )
}
export default FilmsByYear;