import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ReviewCard from "./Cards/ReviewCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {useAuth} from "../context/authContext";
import {useNavigate} from "react-router-dom";

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

    const removeReview = async (filmID, reviewTitle) => {
        try {
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${filmID}`);
            showNotification(`La recensione di ${reviewTitle} è stata rimossa`, "success");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    if (filmReviews.length === 0) {
        return <Typography component="p">
            Non hai ancora aggiunto nessuna recensione! Clicca
            <NavLink to="/log-a-film"> qui </NavLink>
            per recensire un film.
        </Typography>;
    }
    return (
        <Box>
            <h1>Hai recensito {filmReviews.length} film</h1>
            <Grid container spacing={2}>
                { [...filmReviews].reverse().map((review) =>
                    <Grid item key={review._id} size={6}>
                    <ReviewCard review={review} showRemoveButton={true} onRemove={removeReview} />
                    </Grid>
                )}
            </Grid>

        </Box>
    )
}

export default Recensioni;