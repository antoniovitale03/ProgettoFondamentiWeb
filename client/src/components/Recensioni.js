import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ReviewCard from "./Cards/ReviewCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import FilmCard from "./Cards/FilmCard";

function Recensioni(){
    useDocumentTitle("Le mie Recensioni");
    const [filmReviews, setFilmReviews] = useState([]);
    const {showNotification} = useNotification();

    useEffect(() => {
        const fetchReviews = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/reviews/get-reviews');
                const reviews = await response.data;
                setFilmReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
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
        <Box sx={{ width: '90%' }}>
            <h1>Hai recensito {filmReviews.length} film</h1>
            <Grid container spacing={2}>
                { [...filmReviews].reverse().map((review) =>
                    <Grid item key={review._id} size={6}>
                    <ReviewCard review={review}/>
                    </Grid>
                )}
            </Grid>

        </Box>
    )
}

export default Recensioni;