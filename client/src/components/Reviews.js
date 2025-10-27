import useDocumentTitle from "./hooks/useDocumentTitle";
import {useEffect, useState} from "react";
import {Box, Grid, Stack, Typography} from "@mui/material";
import ReviewCard from "./Cards/ReviewCard";
import SearchFilters from "./SearchFilters";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import _ from "lodash";
import GetParams from "./hooks/useGetSearchParams";

function Reviews(){

    const {user} = useAuth();
    const {username} = useParams();

    useDocumentTitle(`Recensioni di ${username}`);
    const [reviews, setReviews] = useState([]);
    const [numReviews, setNumReviews] = useState(0);

    const {showNotification} = useNotification();

    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        minRating: 0,
        sortByDate: "",
        sortByPopularity: ""
    });


    const removeReview = async (filmID, reviewTitle) => {
        try {
            await api.delete(`${process.env.REACT_APP_SERVER}/api/films/reviews/delete-review/${filmID}`);
            showNotification(<strong>Hai rimosso {reviewTitle} dalle tue <a href={`/${user.username}/reviews`} style={{ color: 'green' }}>recensioni</a></strong>, "success");
            setReviews(currentReviews =>
                currentReviews.filter(review => review.film._id !== filmID)
            );
            setNumReviews(num => num - 1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect(() => {
        if( _.isEqual(filters, {genre: "", decade: "", minRating: 0, sortByDate: "", sortByPopularity: ""})){
            api.get(`${process.env.REACT_APP_SERVER}/api/films/reviews/get-reviews/${username}`)
                .then(response => {
                    setReviews(response.data);
                    setNumReviews(response.data.length);
                })
                .catch(error => showNotification(error.response.data, "error"));
        }else{
            const params = GetParams(filters);
            api.get(`${process.env.REACT_APP_SERVER}/api/films/reviews/get-reviews/${username}?${params.toString()}`)
                .then(response => setReviews(response.data))
                .catch(error => showNotification(error.response.data, "error"));
        }
    }, [username, filters, showNotification]);


    return (
        <Box>
            {numReviews !== 0 ?
                <Stack spacing={7}>
                    { user.username === username ?
                        <Typography component="h1" variant="strong">Hai recensito {numReviews} film </Typography>
                        : <Typography component="h1" variant="strong">{username} ha recensito {numReviews} film</Typography>
                    }

                    <SearchFilters filters={filters} setFilters={setFilters} isLikedFilter={false} />

                    <Typography component="p">{reviews.length} recensioni trovate</Typography>

                    <Grid container spacing={2}>
                        { reviews.map(review =>
                            <Grid key={review.filmID} size={6}>
                                <ReviewCard review={review} showRemoveButton={user.username === username} onRemove={removeReview} />
                            </Grid>
                        )}
                    </Grid>
                </Stack> :
                <Box>
                    {user.username === username ?
                        <Typography component="h1" variant="strong">Non hai ancora recensito nessun film</Typography>
                        : <Typography component="h1" variant="strong">{username} non ha ancora recensito nessun film</Typography>
                    }
                </Box>
            }
        </Box>
    )
}

export default Reviews;