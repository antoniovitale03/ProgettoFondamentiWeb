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
import {useParams} from "react-router-dom";
function Profile(){
    const {user} = useAuth();
    const {username} = useParams();

    const {showNotification} = useNotification();
    useDocumentTitle(`Profilo di ${username}`);

    const [profile, setProfile] = useState(null);

    const [favoritesFilms, setFavoritesFilms] = useState(null);


    useEffect( () => {
        async function fetchUser(){
            const response = await api.get(`http://localhost:5001/api/user/${username}/get-profile-info`);
            const profile = await response.data;
            setProfile(profile);
            setFavoritesFilms(profile.favorites);
        }
        fetchUser();
    }, [])

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
            {user.username === username ? <Typography component="h1">Il tuo profilo</Typography> : <Typography component="h1">Profilo di {username}</Typography>}
            {
                profile?.avatar_path ? <Avatar src={`http://localhost:5001/${profile?.avatar_path}`} sx={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }} />
                    : <Avatar sx={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }} />
            }

            {profile?.biography && <Typography component="p">{profile?.biography}</Typography>}
            {profile?.country &&
                <Typography component="p">
                    <LocationOnIcon/> {profile?.country}
                </Typography>
            }

                <Box>
                    <Button component={Link} to={`/${username}/followers`} variant="contained" disabled={profile?.followers === 0}>{profile?.followers} Followers </Button>
                    <Button component={Link} to={`/${username}/following`} variant="contained" disabled={profile?.following === 0}>{profile?.following} Following </Button>
                </Box>


            {user.username === username && <Button href="/settings/modify-profile" variant="contained">Modifica il mio profilo</Button> }


            {favoritesFilms?.length > 0 &&
                <Box>
                    <h1>Film preferiti</h1>
                    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                        {
                            favoritesFilms.map((film) =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites}/>
                            </Grid>)
                        }
                    </Grid>
                    <Divider />
                </Box>
            }


            {profile?.latestWatched.length > 0 &&
                <div>
                    <h1>Ultimi film visti </h1>
                    <Button component={Link} to={`/${user.username}/watched`}>Vedi tutti i film visti</Button>
                    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                        { profile.latestWatched.map((film, index) =>
                            <Grid key={index} size={2}>
                                <FilmCard film={film}/>
                            </Grid>)
                        }
                    </Grid>
                    <Divider />
                </div>
            }

            {profile?.latestReviews.length > 0 &&
                <Box>
                    <h1>Ultime recensioni: </h1>
                    <Button component={Link} to={`/${user.username}/reviews`}>Vedi tutte le recensioni</Button>
                    <Grid container spacing={2}>
                        { profile.latestReviews.map(review =>
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