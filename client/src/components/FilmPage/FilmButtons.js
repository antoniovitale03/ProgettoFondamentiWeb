import {Box, Button, IconButton, MenuItem, Rating, TextField, Tooltip} from "@mui/material";
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
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useAuth} from "../../context/authContext";

function FilmButtons({ film }) {

    const {showNotification} = useNotification();
    const {user} = useAuth();
    //tutti i bottoni hanno stato true (aggiungi) o false (rimuovi)
    const [watchlistButton, setWatchlistButton] = useState(1);
    const [likedButton, setLikedButton] = useState(1);
    const [reviewButton, setReviewButton] = useState(1);
    const [favoritesButton, setFavoritesButton] = useState(1);
    const [watchedButton, setWatchedButton] = useState(1);
    const [lists, setLists] = useState([]);

    const [isReviewMenuOpen, setIsReviewMenuOpen] = useState(false);
    const [isListMenuOpen, setIsListMenuOpen] = useState(false);

    const addToList = async (list) => {
        try{
            await api.post(`http://localhost:5001/api/films/lists/add-to-list/${list.listName}`, {film});
            showNotification(<p>"{film.title}" aggiunto alla lista <a href={`/${user.username}/${list.listName}/list`}>{list.listName}</a></p>, "success")
            setIsListMenuOpen(false);
            setLists(prevLists => prevLists.map(l => l.listName === list.listName ? {...l, isInList: !l.isInList} : l));
        }catch(error){
            showNotification(error.response.data, "error")
        }
    }

    const removeFromList = async (list) => {
        try{
            await api.delete(`http://localhost:5001/api/films/lists/remove-from-list/${film._id}/${list.listName}`);
            showNotification(<p>"{film.title}" rimosso dalla lista <a href={`/${user.username}/${list.listName}/list`}>{list.listName}</a></p>, "success")
            setIsListMenuOpen(false);
            setLists(prevLists => prevLists.map(l => l.listName === list.listName ? {...l, isInList: !l.isInList} : l));
        }catch(error){
            showNotification(error.response.data, "error")
        }
    }

    const listsMenu = [
        lists?.map( list =>
        <MenuItem key={list.listName}>
            <IconButton onClick={ () => {
                if (list.isInList) {
                    removeFromList(list);
                } else {
                    addToList(list);
                }
            } }>
                {list.isInList ? <RemoveIcon /> : <AddIcon />}
            </IconButton>
            {list.listName}
        </MenuItem>
        )
    ]

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
        try{
            await api.post("http://localhost:5001/api/films/watchlist/add-to-watchlist", { film });
            showNotification(<p>"{film.title}" è stato aggiunto alla <a href={`/${user.username}/watchlist`}>watchlist</a></p>, "success");
            setWatchlistButton(0);
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
            showNotification(<p>Hai aggiunto "{film.title}" alle tue <a href={`/${user.username}/reviews`}>recensioni</a></p>, "success");
            setReviewButton(0);
            setReviewRating(0);
            setReview("");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromWatchlist = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/watchlist/remove-from-watchlist/${film.id}`);
            showNotification(<p>"{film.title}" è stato rimosso dalla <a href={`/${user.username}/watchlist`}>watchlist</a></p>, "success")
            setWatchlistButton(1);
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
            showNotification(<p>Hai rimosso "{film.title}" dalle tue <a href={`/${user.username}/reviews`}>recensioni</a></p>, "success");
            setReviewButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/favorites/add-to-favorites', { film });
            showNotification(<p>"{film.title}" è stato aggiunto ai tuoi <a href={`/${user.username}/favorites`}>preferiti</a></p>, "success")
            setFavoritesButton(0);
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const removeFromFavorites = async (event) => {
        event.preventDefault();
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${film.id}`);
            showNotification(<p>"{film.title}" è stato rimosso dai tuoi <a href={`/${user.username}/favorites`}>preferiti</a></p>, "success")
            setFavoritesButton(1);
        }catch(error){
            showNotification(error.response.data, "error");
        }

    }

    const addToWatched = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/films/watched/add-to-watched', { film });
            showNotification(<p>"{film.title}" è stato aggiunto ai tuoi <a href={`/${user.username}/watched`}>film visti</a></p>, "success")
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
            showNotification(<p>"{film.title}" è stato rimosso dai tuoi <a href={`/${user.username}/watched`}>film visti</a></p>, "success")
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

            <Tooltip title={watchlistButton === 1 ? "Aggiungi alla watchlist" : "Rimuovi dalla watchlist"}>
                <IconButton onClick={watchlistButton === 1 ? addToWatchlist : removeFromWatchlist}>
                    {watchlistButton === 1 ? <AccessTimeIcon /> : <AccessTimeFilledIcon />}
                </IconButton>
            </Tooltip>

            <Tooltip title={likedButton === 1 ? "Aggiungi ai film piaciuti" : "Rimuovi dai film piaciuti"}>
                <IconButton onClick={likedButton === 1 ? addToLiked : removeFromLiked}>
                    {likedButton === 1 ? <ThumbUpOffAltIcon/> : <ThumbUpIcon />}
                </IconButton>
            </Tooltip>

                {reviewButton === 1 ?
                    <DropDownMenu buttonContent={<Tooltip title="Aggiungi una recensione"><ReviewsOutlinedIcon /></Tooltip>}
                                  menuContent={reviewMenuItems} isMenuOpen={isReviewMenuOpen} setIsMenuOpen={setIsReviewMenuOpen} /> :
                    <Tooltip title="Rimuovi la recensione">
                        <IconButton onClick={deleteReview}>
                            <ReviewsIcon />
                        </IconButton>
                    </Tooltip>
                }

            <Tooltip title={favoritesButton === 1 ? "Aggiungi ai film preferiti" : "Rimuovi dai film preferiti"}>
                <IconButton onClick={favoritesButton === 1 ? addToFavorites : removeFromFavorites}>
                    {favoritesButton === 1 ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                </IconButton>
            </Tooltip>

            <Tooltip title={watchedButton === 1 ? "Aggiungi ai film visti" : "Rimuovi dai film visti"}>
                <IconButton onClick={watchedButton === 1 ? addToWatched : removeFromWatched}>
                    {watchedButton === 1 ? <VisibilityOutlinedIcon /> : <VisibilityIcon />}
                </IconButton>
            </Tooltip>


            <Tooltip title="Aggiungi o rimuovi dalla lista">
                <DropDownMenu buttonContent={<Tooltip title="Aggiungi o rimuovi da una o più liste"><FormatListBulletedAddIcon /> </Tooltip>}
                              menuContent={listsMenu} isMenuOpen={isListMenuOpen} setIsMenuOpen={setIsListMenuOpen} />
            </Tooltip>

            { /* se aggiungo il film a quelli visti, lo posso riaggiungere se lo vedo altre volte
        //             {watchedButton === 0 ?
        //             <Button onClick={addToWatched}>
        //                 <VisibilityIcon />
        //                 <p>L'ho rivisto di nuovo</p>
        //             </Button>: null
        //             }
        //             </div>
        //             */
            }
        </Box>
    )
}

export default FilmButtons;