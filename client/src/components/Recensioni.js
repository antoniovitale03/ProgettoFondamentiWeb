import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import ReviewCard from "./Cards/ReviewCard";
import {useNotification} from "../context/notificationContext";
import api from "../api";

function Recensioni(){

    useDocumentTitle("Le mie Recensioni");
    const [reviews, setReviews] = useState([]);

    const {showNotification} = useNotification();


    useEffect(() => {
        const getReviews = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/reviews/get-reviews');
                const reviews = await response.data;
                setReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getReviews();
    }, [reviews, showNotification]);

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
                    <h1>Hai recensito {reviews.length} film</h1>
                    <Grid container spacing={2}>
                        { [...reviews].reverse().map(review =>
                            <Grid item key={review.filmID} size={6}>
                                <ReviewCard review={review} showRemoveButton={true} onRemove={removeReview} />
                            </Grid>
                        )}
                    </Grid>
                </Box> : <p>Non c'è ancora nessuna recensione!</p>
            }
        </Box>
    )
}

export default Recensioni;