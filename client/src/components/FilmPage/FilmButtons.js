import {Box, Button, Rating, TextField, Tooltip} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DropDownMenu from "../DropDownMenu";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import ReviewsIcon from "@mui/icons-material/Reviews";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

function FilmButtons({ film }) {

    const {showNotification} = useNotification();
    //tutti i bottoni hanno stato true (aggiungi) o false (rimuovi)
    const [watchlistButton, setWatchlistButton] = useState(1);
    const [likedButton, setLikedButton] = useState(1);
    const [reviewButton, setReviewButton] = useState(1);
    const [favoritesButton, setFavoritesButton] = useState(1);
    const [watchedButton, setWatchedButton] = useState(1);

    useEffect(() => {
        async function fetchFilmStatus(){
            //renderizzo i bottoni in base allo stato attuale del film
            setWatchlistButton(film?.filmStatus.isInWatchlist === true ? 0 : 1);
            setLikedButton(film?.filmStatus.isLiked === true ? 0 : 1);
            setReviewButton(film?.filmStatus.isReviewed === true ? 0 : 1);
            setFavoritesButton(film?.filmStatus.isFavorite === true ? 0 : 1);
            setWatchedButton(film?.filmStatus.isWatched === true ? 0 : 1);
        }
        fetchFilmStatus();
    }, [film])

    const [review, setReview] = useState("");

    //rating in quinti
    const [reviewRating, setReviewRating] = useState(0);

    const addToWatchlist = async (event) => {
        event.preventDefault();
        try{
            await api.post("http://localhost:5001/api/films/watchlist/add-to-watchlist", { film });
            showNotification(`"${film.title}" è stato aggiunto alla watchlist`, "success");
            setWatchlistButton(0);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addReview = async (film, review, reviewRating) => {
        try {
            await api.post('http://localhost:5001/api/films/reviews/add-review', {
                film, review, reviewRating
            })
            showNotification(`La recensione di "${film.title}" è stata salvata correttamente!`)
            setReviewButton(0);
            setReviewRating(0);
            setReview("");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${film.id}`)
            showNotification(`"${film.title}" è stato rimosso dalla watchlist`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToLiked = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/liked/add-to-liked', { film });
            showNotification(`"${film.title}" è stato aggiunto ai film piaciuti`, "success");
            setLikedButton(0);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromLiked = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/liked/remove-from-liked/${film.id}`);
            showNotification(`"${film.title}" è stato rimosso dai film piaciuti`, "success");
            setLikedButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const deleteReview = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${film.id}`);
            showNotification(`La recensione di "${film.title}" è stata rimossa`, "success");
            setReviewButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/favorites/add-to-favorites', { film });
            showNotification(`"${film.title}" è stato aggiunto ai film preferiti`, "success");
            setFavoritesButton(0);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${film.id}`);
            showNotification(`"${film.title}" è stato rimosso dai film preferiti`, "success");
            setFavoritesButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addToWatched = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/watched/add-to-watched', { film });
            showNotification(`"${film.title}" è stato aggiunto ai film visti`, "success");
            setWatchedButton(0);
            //se ho visto un film, ovviamente viene eliminato dalla watchlist automaticamente
            setWatchlistButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatched = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${film.id}`);
            showNotification(`"${film.title}" è stato rimosso dai film visti`, "success");
            setWatchedButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const reviewMenuItems = (<>
            <TextField id="outlined-multiline-flexible" multiline rows={7} sx= {{ width: '350px' }} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
            <Rating name="review-rating" value={reviewRating} onChange={(event,rating) => setReviewRating(rating)} precision={0.5} />
            <Button onClick={() => addReview(film, review, reviewRating)}>
                Salva
            </Button>
        </>
    )

    return(
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap:6 }}>
            {watchlistButton === 1 ?
                <Tooltip title="Aggiungi alla watchlist">
                    <Button onClick={addToWatchlist}>
                        <AccessTimeIcon />
                    </Button>
                </Tooltip> :
                <Tooltip title="Rimuovi dalla watchlist">
                    <Button onClick={removeFromWatchlist}>
                        <AccessTimeFilledIcon />
                    </Button>
                </Tooltip>
            }
            {likedButton === 1 ?
                <Tooltip title="Aggiungi ai film piaciuti">
                    <Button onClick={addToLiked}>
                        <ThumbUpOffAltIcon />
                    </Button>
                </Tooltip> :
                <Tooltip title="Rimuovi dai film piaciuti">
                    <Button onClick={removeFromLiked}>
                        <ThumbUpIcon />
                    </Button>
                </Tooltip>
            }

            {reviewButton === 1 ?
                <Tooltip title="Aggiungi una recensione">
                    <DropDownMenu buttonContent={<ReviewsOutlinedIcon />} menuContent={reviewMenuItems} />
                </Tooltip>
                :
                <Tooltip title="Rimuovi una recensione">
                    <Button onClick={deleteReview}>
                        <ReviewsIcon />
                    </Button>
                </Tooltip>
            }

            {favoritesButton === 1 ?
                <Tooltip title="Aggiungi ai film preferiti">
                    <Button onClick={addToFavorites}>
                        <FavoriteBorderIcon />
                    </Button>
                </Tooltip>:
                <Tooltip title="Rimuovi dai film preferiti">
                    <Button onClick={removeFromFavorites}>
                        <FavoriteIcon />
                    </Button>
                </Tooltip>
            }

            {watchedButton === 1 ?
                <Tooltip title="Aggiungi ai film visti">
                    <Button onClick={addToWatched}>
                        <VisibilityOutlinedIcon />
                    </Button>
                </Tooltip>
                :
                <Tooltip title="Rimuovi dai film visti">
                    <Button onClick={removeFromWatched}>
                        <VisibilityIcon />
                    </Button>
                </Tooltip>
            }
            { /* se aggiungo il film a quelli visti, lo posso riaggiungere se lo vedo altre volte
        //             {watchedButton === 0 ?
        //             <Button onClick={addToWatched}>
        //                 <VisibilityIcon />
        //                 <p>L'ho rivisto di nuovo</p>
        //             </Button>: null
        //             }
        //             </div>
        //             */ }
        </Box>
    )
}

export default FilmButtons;