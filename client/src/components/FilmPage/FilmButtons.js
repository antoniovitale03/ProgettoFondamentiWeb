import {Box, IconButton, MenuItem, Rating, TextField, Tooltip} from "@mui/material";
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
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import "../../CSS/FilmButton.css"
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import {useAuth} from "../../context/authContext"

function FilmButtons({ film }) {

    const {showNotification} = useNotification();
    const {user} = useAuth();
    //tutti i bottoni hanno stato 1 (in watchlist, ...) o stato 0 (non in watchlist, ...)

    const [buttons, setButtons] = useState({
        watchlist: 1,
        liked: 1,
        review: 1,
        favorite: 1,
        watched: 1,
        lists: []
    });

    const [isReviewMenuOpen, setIsReviewMenuOpen] = useState(false);
    const [isListsMenuOpen, setIsListsMenuOpen] = useState(false);

    const [review, setReview] = useState("");
    //rating in quinti
    const [reviewRating, setReviewRating] = useState(0);


    useEffect(() => {
        //renderizzo i bottoni in base allo stato attuale del film (ogni volta che carico un film)
        if(film){
            setButtons({
                watchlist: film.status.isInWatchlist,
                liked: film.status.isLiked,
                review: film.status.isReviewed,
                favorite: film.status.isFavorite,
                watched: film.status.isWatched,
                lists: film.status.lists,
            });
        }
    }, [film])


    const addToWatchlist = async (event) => {
        event.preventDefault();
        try{
            await api.post("http://localhost:5001/api/films/watchlist/add-to-watchlist", { film });
            showNotification(<strong>"{film.title}" è stato aggiunto alla <a href={`/${user.username}/watchlist`} style={{ color: 'green' }}>watchlist</a></strong>, "success");
            setButtons({...buttons, watchlist: 1});
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    const removeFromWatchlist = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${film.id}`);
            showNotification(<strong>"{film.title}" è stato rimosso dalla <a href={`/${user.username}/watchlist`} style={{ color: 'green' }}>watchlist</a></strong>, "success")
            setButtons({...buttons, watchlist: 0});
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToLiked = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/liked/add-to-liked', { film });
            showNotification(<strong>"{film.title}" è stato aggiunto ai film piaciuti</strong>, "success");
            setButtons({...buttons, liked: 1});
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromLiked = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/liked/remove-from-liked/${film.id}`);
            showNotification(<strong>"{film.title}" è stato rimosso dai film piaciuti</strong>, "success");
            setButtons({...buttons, liked: 0});
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addReview = async (film, review, reviewRating) => {
        try {
            setIsReviewMenuOpen(false);
            await api.post('http://localhost:5001/api/films/reviews/add-review', {
                film, review, reviewRating
            });
            showNotification(<strong>Hai aggiunto "{film.title}" alle tue <a href={`/${user.username}/reviews`} style={{ color: 'green' }}>recensioni</a></strong>, "success");
            setButtons({...buttons, review: 1});
            setReviewRating(0);
            setReview("");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const reviewMenuItems = (
        <Box>
            <TextField id="outlined-multiline-flexible" multiline rows={7} sx= {{ width: '350px' }} label="Scrivi la recensione" value={review} onChange={(e) => setReview(e.target.value)} />
            <Rating name="review-rating" value={reviewRating} onChange={(event, rating) => setReviewRating(rating)} precision={0.5} />
            <IconButton onClick={() => addReview(film, review, reviewRating)}>
                Salva
            </IconButton>
        </Box>
    )


    const deleteReview = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/reviews/delete-review/${film.id}`);
            showNotification(<strong>Hai rimosso "{film.title}" dalle tue <a href={`/${user.username}/reviews`} style={{ color: 'green' }}>recensioni</a></strong>, "success");
            setButtons({...buttons, review: 0});
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/favorites/add-to-favorites', { film });
            showNotification(<strong>"{film.title}" è stato aggiunto ai tuoi <a href={`/${user.username}/favorites`} style={{ color: 'green' }}>preferiti</a></strong>, "success")
            setButtons({...buttons, favorite: 1});
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${film.id}`);
            showNotification(<strong>"{film.title}" è stato rimosso dai tuoi <a href={`/${user.username}/favorites`} style={{ color: 'green' }}>preferiti</a></strong>, "success")
            setButtons({...buttons, favorite: 0});
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addToWatched = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/watched/add-to-watched', { film });
            showNotification(<strong>"{film.title}" è stato aggiunto ai tuoi <a href={`/${user.username}/watched`} style={{ color: 'green' }}>film visti</a></strong>, "success")
            setButtons({...buttons, watched: 1, watchlist: 0});
            //se ho visto un film, ovviamente viene eliminato dalla watchlist automaticamente
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatched = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/watched/remove-from-watched/${film.id}`);
            showNotification(<strong>"{film.title}" è stato rimosso dai tuoi <a href={`/${user.username}/watched`} style={{ color: 'green' }}>film visti</a></strong>, "success")
            setButtons({...buttons, watched: 0});
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    const addToList = async (list) => {
        try{
            await api.post(`http://localhost:5001/api/films/lists/add-to-list/${list.name}`, {film});
            showNotification(<strong>"{film.title}" aggiunto alla lista <a href={`/${user.username}/${list.name}/list`} style={{ color: 'green' }}>{list.name}</a></strong>, "success")
            setIsListsMenuOpen(false);
            setButtons({...buttons, lists: buttons.lists.map(l => l.name === list.name ? {...l, isInList: !l.isInList} : l)});
        }catch(error){
            showNotification(error.response.data, "error")
        }
    }

    const removeFromList = async (list) => {
        try{
            await api.delete(`http://localhost:5001/api/films/lists/remove-from-list/${film._id}/${list.name}`);
            showNotification(<strong>"{film.title}" rimosso da <a href={`/${user.username}/${list.name}/list`} style={{ color: 'green' }}>"{list.name}"</a></strong>, "success")
            setIsListsMenuOpen(false);
            setButtons({...buttons, lists: buttons.lists.map(l => l.name === list.name ? {...l, isInList: !l.isInList} : l)});
        }catch(error){
            showNotification(error.response.data, "error")
        }
    }

    const listsMenu = [
        buttons.lists?.map( list =>
            <MenuItem key={list.name}>
                <IconButton onClick={ () => {
                    if (list.isInList) {
                        removeFromList(list);
                    } else {
                        addToList(list);
                    }
                } }>
                    {list.isInList ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
                {list.name}
            </MenuItem>
        )
    ]

    return(
        <Box className="box-button">
            <Tooltip title={buttons.watchlist === 0 ? "Aggiungi alla watchlist" : "Rimuovi dalla watchlist"}>
                <IconButton onClick={buttons.watchlist === 0 ? addToWatchlist : removeFromWatchlist}>
                    {buttons.watchlist === 0 ? <AccessTimeIcon className="icon" />
                        : <AccessTimeFilledIcon className="icon time-icon" />
                    }
                </IconButton>
            </Tooltip>

            <Tooltip title={buttons.liked === 0 ? "Aggiungi ai film piaciuti" : "Rimuovi dai film piaciuti"}>
                <IconButton onClick={buttons.liked === 0 ? addToLiked : removeFromLiked}>
                    {buttons.liked === 0 ?
                        <ThumbUpOffAltIcon className="icon" /> :
                        <ThumbUpIcon className="icon" id="thumb-icon" />
                    }
                </IconButton>
            </Tooltip>

            {buttons.review === 0 ?
                <DropDownMenu buttonContent={<Tooltip title="Aggiungi una recensione"><ReviewsOutlinedIcon className="icon" /></Tooltip>}
                              menuContent={reviewMenuItems} isMenuOpen={isReviewMenuOpen} setIsMenuOpen={setIsReviewMenuOpen} /> :
                <Tooltip title="Rimuovi la recensione">
                    <IconButton onClick={deleteReview}>
                        <ReviewsIcon className="icon"/>
                    </IconButton>
                </Tooltip>
            }

            <Tooltip title={buttons.favorite === 0 ? "Aggiungi ai film preferiti" : "Rimuovi dai film preferiti"}>
                <IconButton onClick={buttons.favorite === 0 ? addToFavorites : removeFromFavorites}>
                    {buttons.favorite === 0 ?
                        <FavoriteBorderIcon className="icon"/>:
                        <FavoriteIcon className="icon" id="favorite-icon" />
                    }
                </IconButton>
            </Tooltip>

            <Tooltip title={buttons.watched === 0 ? "Aggiungi ai film visti" : "Rimuovi dai film visti"}>
                <IconButton onClick={buttons.watched === 0 ? addToWatched : removeFromWatched}>
                    {buttons.watched === 0 ?
                        <AddCircleOutlineIcon className="icon" />:
                        <RemoveCircleOutlineIcon className="icon remove-icon" />
                    }
                </IconButton>
            </Tooltip>

            <Tooltip title="Aggiungi o rimuovi dalla lista">
                <DropDownMenu buttonContent={<FormatListBulletedAddIcon className="icon"/>}
                              menuContent={listsMenu} isMenuOpen={isListsMenuOpen} setIsMenuOpen={setIsListsMenuOpen} />
            </Tooltip>
        </Box>
    )
}

export default FilmButtons;