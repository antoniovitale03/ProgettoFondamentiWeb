import {useAuth} from "../context/authContext"
import useDocumentTitle from "./hooks/useDocumentTitle"
import {Avatar, Box, Button, Divider, Grid, Typography} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import {useEffect, useState} from "react";
import api from "../api";
import {useNotification} from "../context/notificationContext";
import FilmCard from "./Cards/FilmCard";
import ReviewCard from "./Cards/ReviewCard";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";

function Profile(){
    const {user} = useAuth();
    const {username} = useParams();

    const {showNotification} = useNotification();

    useDocumentTitle(`Profilo di ${username}`);

    const [profile, setProfile] = useState(null);

    const [favoritesFilms, setFavoritesFilms] = useState(null);


    const removeFromFavorites = async (filmID, filmTitle) => {
        try{
            await api.delete(`${process.env.REACT_APP_SERVER}/api/films/favorites/remove-from-favorites/${filmID}`);
            showNotification(<strong>${filmTitle} è stato rimosso dai tuoi <a href={`/${user.username}/favorites`} style={{ color: 'green' }}>preferiti</a> </strong>, "success");
            setFavoritesFilms(currentFilms =>
                currentFilms.filter(film => film._id !== filmID));
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect( () => {
        api.get(`${process.env.REACT_APP_SERVER}/api/user/${username}/get-profile-info`)
            .then(response => {
                setProfile(response.data);
                setFavoritesFilms(response.data.favorites);
            })
        .catch(error => showNotification(error.response.data, "error"));
    }, [username, showNotification])


    if(profile){
        return (
            <Box>
                {user.username === username ? <Typography component="h1">Il tuo profilo</Typography> : <Typography component="h1">Profilo di {username}</Typography>}
                {
                    profile.avatar_path ? <Avatar sx={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }} />
                        : <Avatar sx={{ width: 150, height: 150, borderRadius: "50%", marginBottom: 10 }} />
                }

                {profile.biography && <Typography component="p">{profile.biography}</Typography>}
                {profile.country &&
                    <Typography component="p">
                        <LocationOnIcon/> {profile.country}
                    </Typography>
                }

                <Button component={Link} to={`/${username}/followers`} disabled={profile.followers === 0}>{profile.followers} Followers </Button>
                <Button component={Link} to={`/${username}/following`} disabled={profile.following === 0}>{profile.following} Following </Button>

                {user.username === username && <Button component={Link} to="/settings/modify-profile" variant="contained">Modifica il mio profilo</Button> }

                {
                    favoritesFilms &&
                    <Box>
                        <h1>Film preferiti</h1>
                        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                            {
                                favoritesFilms.map((film) =>
                                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                        <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites}/>
                                    </Grid>)
                            }
                        </Grid>
                        <Divider />
                    </Box>
                }

                {
                    profile.latestWatched &&
                    <Box>
                        <Typography component="h1">Ultimi film visti
                        <Button component={Link} to={`/${username}/watched`}> <InfoIcon /> Più dettagli </Button>
                        </Typography>
                        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                            { profile.latestWatched.map((film) =>
                                <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                                    <FilmCard film={film}/>
                                </Grid>)
                            }
                        </Grid>
                        <Divider />
                    </Box>
                }

                {
                    profile.latestReviews &&
                    <Box>
                        <Typography component="h1">Ultime recensioni
                        <Button component={Link} to={`/${username}/reviews`}><InfoIcon /> Più dettagli</Button>
                        </Typography>
                        <Grid container spacing={2}>
                            { profile.latestReviews.map(review =>
                                <Grid key={review.film._id} size={6}>
                                    <ReviewCard review={review}/>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                }


            </Box>
        )
    }

}

export default Profile;