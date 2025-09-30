import api from "../api";
import {useEffect, useState} from "react";
import {useAuth} from "../context/authContext";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Rating, Typography} from "@mui/material";
import {Link} from "react-router-dom";

function Activity(){

    const [activity, setActivity] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        async function fetchActivity(){
            const response = await api.get('http://localhost:5001/api/user/get-activity');
            let activity = await response.data;
            setActivity(activity);
        }
        fetchActivity();
    })

    function formatAction(action){
        switch (action) {
            case "ADD_TO_WATCHED": return "Aggiunto a Visti";
            case "ADD_TO_FAVORITES": return "Aggiunto ai Preferiti";
            case "ADD_TO_WATCHLIST": return "Aggiunto alla Watchlist";
            case "ADD_REVIEW": return "Aggiunto alle recensioni";
            default: return action;
        }
    }


    return(
        <List sx={{ width: '30%' }}>
            {
                activity?.map(activity => {
                    if (activity.action === "ADD_TO_WATCHLIST") {
                        return (
                        <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                            <Typography component={Link} to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</Typography>
                            <Typography component="p">aggiunto alla</Typography>
                            <Typography component={Link} to={'/watchlist'}>Watchlist</Typography>
                            <Typography component="p">da</Typography>
                            <Typography component={Link} to={'/profile'}>{user.username}</Typography>
                                <ListItemIcon>
                                    <img src={`http://localhost:5001/${activity.avatar}`} alt="avatar" style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                </ListItemIcon>
                            <Typography component="p">in data {activity.date}</Typography>
                        </ListItem>)
                    }
                    if (activity.action === "ADD_TO_FAVORITES") {
                        return(
                            <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                                <Typography component={Link} to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</Typography>
                                <Typography component="p">aggiunto ai</Typography>
                                <Typography component={Link} to={'/favorites'}>Preferiti</Typography>
                                <Typography component="p">da</Typography>
                                <Typography component={Link} to={'/profile'}>{user.username}</Typography>
                                <ListItemIcon>
                                    <img src={`http://localhost:5001/${activity.avatar}`} alt="avatar" style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                </ListItemIcon>
                                <Typography component="p">in data {activity.date}</Typography>
                            </ListItem>)
                    }
                    if (activity.action === "ADD_REVIEW") {
                        return (
                            <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                                <Typography component={Link} to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</Typography>
                                <Typography component="p">aggiunto alle</Typography>
                                <Typography component={Link} to={'/recensioni'}>Recensioni</Typography>
                                <Typography component="p">da</Typography>
                                <Typography component={Link} to={'/profile'}>{user.username}</Typography>
                                <ListItemIcon>
                                    <img src={`http://localhost:5001/${activity.avatar}`} alt="avatar" style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                </ListItemIcon>
                                <Typography component="p">con voto </Typography>
                                <Rating name="read-only" value={activity.rating} readOnly />
                                <Typography component="p">in data {activity.date}</Typography>
                            </ListItem>)
                    }
                    if (activity.action === "ADD_TO_WATCHED") {
                        return (
                            <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                                <Typography component={Link} to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</Typography>
                                <Typography component="p">aggiunto ai</Typography>
                                <Typography component={Link} to={'/watched'}>Film visti</Typography>
                                <Typography component="p">da</Typography>
                                <Typography component={Link} to={'/profile'}>{user.username}</Typography>
                                <ListItemIcon>
                                    <img src={`http://localhost:5001/${activity.avatar}`} alt="avatar" style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                </ListItemIcon>
                                <Typography component="p">in data {activity.date}</Typography>
                            </ListItem>)
                    }
                })

            }
        </List>
    )
}
export default Activity;