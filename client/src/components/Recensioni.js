import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ReviewCard from "./ReviewCard";

function Recensioni(){
    useDocumentTitle("Le mie Recensioni");
    const [filmReviews, setFilmReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try{
                const response = await fetch('http://localhost:5001/api/films/get-reviews', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('Impossibile recuperare le recensioni');
                }
                const reviews = await response.json();
                setFilmReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                console.log(error);
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
            { filmReviews.map( (review) => <ReviewCard key={review._id} review={review} /> ) }
        </div>
    )
}

export default Recensioni;