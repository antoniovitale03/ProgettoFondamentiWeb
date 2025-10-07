import useDocumentTitle from "./hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import ReviewCard from "./Cards/ReviewCard";
import SearchFilters from "./SearchFilters";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import _ from "lodash";

function Reviews(){

    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Recensioni di ${username}`);
    const [reviews, setReviews] = useState(null);
    const [numReviews, setNumReviews] = useState(null);

    const {showNotification} = useNotification();

    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: ""
    });

    useEffect(() => {
        const getReviews = async () => {
            try{
                if( _.isEqual(filters, {genre: "", decade: "", minRating: 0, sortByDate: "", sortByPopularity: ""})){
                    const response = await api.get(`http://localhost:5001/api/films/reviews/get-reviews/${username}`);
                    const films = await response.data;
                    setReviews(films);
                    console.log(films);
                    setNumReviews(films.length);
                }else{
                    const params = new URLSearchParams();
                    if (filters.genre !== "") params.append("genre", filters.genre);
                    if (filters.decade !== "") params.append("decade", filters.decade);
                    if (filters.minRating !== 0) params.append("minRating", filters.minRating);
                    if (filters.sortByDate !== "") params.append("sortByDate", filters.sortByDate);
                    if (filters.sortByPopularity !== "") params.append("sortByPopularity", filters.sortByPopularity);

                    const response = await api.get(`http://localhost:5001/api/films/reviews/get-reviews/${username}?${params.toString()}`);
                    const films = await response.data;
                    setReviews(films);
                }
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        getReviews();
    }, [username, filters, showNotification]);

    const removeReview = async (filmID, reviewTitle) => {
        try {
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${filmID}`);
            showNotification(`La recensione di "${reviewTitle}" è stata rimossa`, "success");
            setReviews(currentReviews =>
                currentReviews.filter(review => review.film._id !== filmID)
            );
            setNumReviews(num => num - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return (
        <Box>
            {reviews ?
                <Box>
                    { user.username === username ? <h1>Hai recensito {numReviews} film </h1> : <h1>{username} ha recensito {numReviews} film</h1> }

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

                    <p>{reviews.length} recensioni trovate</p>

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