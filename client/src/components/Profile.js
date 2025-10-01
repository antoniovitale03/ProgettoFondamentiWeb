import {useAuth} from "../context/authContext"
import useDocumentTitle from "./useDocumentTitle"
import {
    Avatar,
    Input,
    Box,
    Button,
    Divider,
    Grid,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Tooltip,
    Typography
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import ReviewCard from "./Cards/ReviewCard";
import CloseIcon from '@mui/icons-material/Close';
import {Link, NavLink, useNavigate} from "react-router-dom";
import logo from "../assets/images/AppLogo.png";
import * as React from "react";
import PersonIcon from "@mui/icons-material/Person";
import ListIcon from "@mui/icons-material/List";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import DropDownMenu from "./DropDownMenu";

function Profile(){
    const {user} = useAuth();

    const {showNotification} = useNotification();
    useDocumentTitle("Il mio profilo");

    const [favoritesFilms, setFavoritesFilms] = useState(null);
    const [watchedFilms, setWatchedFilms] = useState(null);
    const [filmsReviews, setFilmsReviews] = useState(null);

    //numero di following e followers
    const [followers, setFollowers] = useState(null);
    const [following, setFollowing] = useState(null);

    //effetto che calcola il numero di followers e persone seguite dall'utente (solo al primo rendering)
    useEffect( () => {
        async function fetchFollowersAndFollowing(){
            try{
                const response = await api.get(`http://localhost:5001/api/user/get-followers-and-following`);
                const userData = await response.data;
                setFollowers(userData.followers);
                setFollowing(userData.following);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchFollowersAndFollowing();
    }, [])


    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/favorites/get-favorites');
                const films = await response.data;
                setFavoritesFilms(films);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchFavorites();
    }, [showNotification])

    useEffect(()=>{
        async function getWatchedFilms(){
            try{
                const response = await api.get('http://localhost:5001/api/films/watched/get-watched')
                const watchedFilms = await response.data;
                setWatchedFilms(watchedFilms)
            }catch(error){
                showNotification(error.response.data, "error");
            }

        }
        getWatchedFilms();
    }, [showNotification])

    useEffect(() => {
        const fetchReviews = async () => {
            try{
                const response = await api.get('http://localhost:5001/api/films/reviews/get-reviews');
                const reviews = await response.data;
                setFilmsReviews(reviews); // Salviamo i film nello stato
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchReviews();
    }, [showNotification]);

    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(`"${filmTitle}" è stato rimosso dai preferiti`, "success");
            setFavoritesFilms(currentFilms =>
                currentFilms.filter(film => film._id !== filmID));
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }
    return (
        <Box>
            {user && <Typography component="p">Benvenuto nel profilo, {user.username}!</Typography>}
            {
                user.avatar_path ? <Avatar src={`http://localhost:5001/${user.avatar_path}`} style={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }} />
                    : <Avatar />
            }


            {user.biography && <Typography component="p">{user.biography}</Typography>}
            {user.country &&
                <Typography component="p">
                    <LocationOnIcon/> {user.country}
                </Typography>

            }

            { followers === user.followersNum && following === user.followingNum ?
                <Box>
                    <Button component={Link} to={`/${user.username}/followers`} variant="contained" disabled={user.followersNum === 0}>{user.followersNum} Followers </Button>
                    <Button component={Link} to={`/${user.username}/following`} variant="contained" disabled={user.followingNum === 0}>{user.followingNum} Following </Button>
                </Box>
                : null
            }



            <Button href="/settings/modify-profile" variant="contained">Modifica il mio profilo</Button>

            {favoritesFilms &&
                <Box>
                    <h1>Film preferiti</h1>
                    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                        {
                            [...favoritesFilms].reverse().map((film) =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites}/>
                            </Grid>)
                        }
                    </Grid>
                    <Divider />
                </Box>
            }



            {watchedFilms &&
                <div>
                    <h1>Ultimi film visti (4)</h1>
                    <Button component={Link} to="/lista-film">Vedi tutti i miei film visti</Button>
                    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                        { [...watchedFilms].reverse().slice(0, 4).map((film, index) =>
                            <Grid key={index} size={2}>
                                <FilmCard film={film}/>
                            </Grid>)
                        }
                    </Grid>
                    <Divider />
                </div>
            }


            {filmsReviews &&
                <Box>
                    <h1>Ultime recensioni fatte (4): </h1>
                    <Button component={Link} to="/recensioni">Vedi tutte le mie recensioni</Button>
                    <Grid container spacing={2}>
                        { [...filmsReviews].reverse().slice(0, 4).map(review =>
                            <Grid key={review.filmID} size={6}>
                                <ReviewCard review={review}/>
                            </Grid>)
                        }
                    </Grid>
                </Box>
            }
        </Box>
    )
}

export default Profile;