import {Box, IconButton,Rating, TextField, Tooltip} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DropDownMenu from "./DropDownMenu";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import ReviewsIcon from "@mui/icons-material/Reviews";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "../CSS/FilmButton.css"

function FilmButtons({ film }) {

    const {showNotification} = useNotification();
    //tutti i bottoni hanno stato 1 (aggiungi) o stato 0 (rimuovi)
    const [watchlistButton, setWatchlistButton] = useState(1);
    const [likedButton, setLikedButton] = useState(1);
    const [reviewButton, setReviewButton] = useState(1);
    const [favoritesButton, setFavoritesButton] = useState(1);
    const [watchedButton, setWatchedButton] = useState(1);
    const [lists, setLists] = useState([])

    useEffect(() => {
        const fetchFilmStatus = async () => {
            //renderizzo i bottoni in base allo stato attuale del film
            if(film){
                setWatchlistButton(film.status.isInWatchlist === true ? 0 : 1);
                setLikedButton(film.status.isLiked === true ? 0 : 1);
                setReviewButton(film.status.isReviewed === true ? 0 : 1);
                setFavoritesButton(film.status.isFavorite === true ? 0 : 1);
                setWatchedButton(film.status.isWatched === true ? 0 : 1);
                setLists(film.status.listsNames);
            }
        }
        fetchFilmStatus();
    }, [film])

    const [review, setReview] = useState("");

    //rating in quinti
    const [reviewRating, setReviewRating] = useState(0);

    const addToWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(0);
        try{
            await api.post("http://localhost:5001/api/films/watchlist/add-to-watchlist", { film })
            showNotification(`${film.title} è stato aggiunto alla watchlist`, "success")
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
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatchlist = async (event) => {
        event.preventDefault();
        setWatchlistButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${film.id}`)
            showNotification(`${film.title} è stato rimosso dalla watchlist`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToLiked = async (event) => {
        event.preventDefault();
        setLikedButton(0);
        try{
            await api.post('http://localhost:5001/api/films/liked/add-to-liked', { film })
            showNotification(`${film.title} è stato aggiunto ai film piaciuti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromLiked = async (event) => {
        event.preventDefault();
        setLikedButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/liked/remove-from-liked/${film.id}`)
            showNotification(`${film.title} è stato rimosso dai film piaciuti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const deleteReview = async (event) => {
        event.preventDefault();
        setReviewButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${film.id}`)
            showNotification(`La recensione di ${film.title} è stata rimossa`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        setFavoritesButton(0);
        try{
            await api.post('http://localhost:5001/api/films/favorites/add-to-favorites', { film })
            showNotification(`${film.title} è stato aggiunto ai film preferiti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromFavorites = async (event) => {
        event.preventDefault();
        setFavoritesButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${film.id}`)
            showNotification(`${film.title} è stato rimosso dai film preferiti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addToWatched = async (event) => {
        event.preventDefault();
        setWatchedButton(0);
        //se ho visto un film, ovviamente viene eliminato dalla watchlist automaticamente
        setWatchlistButton(1);
        try{
            await api.post('http://localhost:5001/api/films/watched/add-to-watched', { film });
            showNotification(`${film.title} è stato aggiunto ai film visti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatched = async (event) => {
        event.preventDefault();
        setWatchedButton(1);
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${film.id}`);
            showNotification(`${film.title} è stato rimosso dai film visti`, "success")
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const reviewMenuItems = (<>
            <TextField id="outlined-multiline-flexible" multiline rows={7} sx= {{ width: '350px' }} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
            <Rating name="review-rating" value={reviewRating} onChange={(event,rating) => setReviewRating(rating)} precision={0.5} />
            <IconButton onClick={() => addReview(film, review, reviewRating)}>
                Salva
            </IconButton>
        </>
    )
    return(
        <Box className="box-button">
            {watchlistButton === 1 ?
                <Tooltip title="Aggiungi alla watchlist">
                    <IconButton onClick={addToWatchlist}>
                        <AccessTimeIcon className="icon"/>
                    </IconButton>
                </Tooltip> :
                <Tooltip title="Rimuovi dalla watchlist">
                    <IconButton onClick={removeFromWatchlist}>
                        <AccessTimeFilledIcon className="icon time-icon"/>
                    </IconButton>
                </Tooltip>
            }
            {likedButton === 1 ?
                <Tooltip title="Aggiungi ai film piaciuti">
                    <IconButton onClick={addToLiked}>
                        <ThumbUpOffAltIcon className="icon"/>
                    </IconButton>
                </Tooltip> :
                <Tooltip title="Rimuovi dai film piaciuti">
                    <IconButton onClick={removeFromLiked}>
                        <ThumbUpIcon className="icon thumb-icon"/>
                    </IconButton>
                </Tooltip>
            }

            {reviewButton === 1 ?
                    <DropDownMenu buttonContent={
                        <Tooltip title="Aggiungi una recensione">
                            <IconButton>
                                <ReviewsOutlinedIcon className="icon"/>
                            </IconButton>
                        </Tooltip>
                        } menuContent={reviewMenuItems} />
                :
                <Tooltip title="Rimuovi una recensione">
                    <IconButton onClick={deleteReview}>
                        <ReviewsIcon className="icon"/>
                    </IconButton>
                </Tooltip>
            }

            {favoritesButton === 1 ?
                <Tooltip title="Aggiungi ai film preferiti">
                    <IconButton onClick={addToFavorites}>
                        <FavoriteBorderIcon className="icon"/>
                    </IconButton>
                </Tooltip>:
                <Tooltip title="Rimuovi dai film preferiti">
                    <IconButton onClick={removeFromFavorites}>
                        <FavoriteIcon className="icon favorite-icon"/>
                    </IconButton>
                </Tooltip>
            }

            {watchedButton === 1 ?
                <Tooltip title="Aggiungi ai film visti">
                    <IconButton onClick={addToWatched}>
                        <AddCircleOutlineIcon className="icon"/>
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title="Rimuovi dai film visti">
                    <IconButton onClick={removeFromWatched}>
                        <RemoveCircleOutlineIcon className="icon remove-icon"/>
                    </IconButton>
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