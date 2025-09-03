import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ReviewCard from "./ReviewCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";

function Recensioni(){
    useDocumentTitle("Le mie Recensioni");
    const [filmReviews, setFilmReviews] = useState([]);
    const {showNotification} = useNotification();

    useEffect(() => {
        const fetchReviews = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/get-reviews');
                const reviews = await response.data;
                setFilmReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data);
            }
        }
        fetchReviews();
    });

    if (filmReviews.length === 0) {
        return <Typography component="p">
            Non hai ancora aggiunto nessuna recensione! Clicca
            <NavLink to="/log-a-film"> qui </NavLink>
            per recensire un film.
        </Typography>;
    }
    return (
        <div>
            <p>Lista delle recensioni</p>
            <h1>Hai recensito {filmReviews.length} film</h1>
            { filmReviews.map( (review) => <ReviewCard key={review._id} review={review} /> ) }
        </div>
    )
}

export default Recensioni;