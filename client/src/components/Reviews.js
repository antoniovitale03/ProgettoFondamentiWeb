import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import ReviewCard from "./Cards/ReviewCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";

function Reviews(){

    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Recensioni di ${username}`);
    const [reviews, setReviews] = useState([]);

    const {showNotification} = useNotification();


    useEffect(() => {
        const getReviews = async () => {
            try{
                const response = await api.get(`http://localhost:5001/api/films/reviews/get-reviews/${username}`);
                const reviews = await response.data;
                setReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getReviews();
    }, [showNotification]);

    const removeReview = async (filmID, reviewTitle) => {
        try {
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${filmID}`);
            showNotification(`La recensione di "${reviewTitle}" è stata rimossa`, "success");
            setReviews(currentReviews =>
                currentReviews.filter(film => film.id !== filmID)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return (
        <Box>
            {reviews.length !== 0 ?
                <Box>
                    { user.username === username ? <h1>Hai recensito {reviews.length} film </h1> : <h1>{username} ha recensito {reviews.length} film</h1> }
                    <Grid container spacing={2}>
                        { reviews.map(review =>
                            <Grid item key={review.filmID} size={6}>
                                <ReviewCard review={review} showRemoveButton={user.username === username} onRemove={removeReview} />
                            </Grid>
                        )}
                    </Grid>
                </Box> :
                <Box>
                    {user.username === username ? <h1>Non hai ancora recensito nessun film</h1> : <h1>{username} non ha ancora recensito nessun film</h1> }
                </Box>
            }
        </Box>
    )
}

export default Reviews;