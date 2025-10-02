import api from "../api";
import {useEffect, useState} from "react";
import {useAuth} from "../context/authContext";
import {
    Avatar,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Rating,
    Typography
} from "@mui/material";
import {Link, NavLink} from "react-router-dom";

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



    return(
        <List sx={{ width: '60%' }}>
            {
                activity?.map(activity => {
                    if (activity.action === "ADD_TO_WATCHLIST") {
                        return (
                        <ListItem key={activity.id}>
                            <Typography component="p">
                                <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>  aggiunto alla
                                <NavLink to={`/${activity.username}/watchlist`}> Watchlist</NavLink>   da
                                <NavLink to={`/${activity.username}/profile`}>{activity.username}</NavLink>
                                    <ListItemIcon>
                                        <Avatar src={`http://localhost:5001/${activity.avatar}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                    </ListItemIcon>   in data {activity.date}
                            </Typography>
                        </ListItem>)
                    }
                    if (activity.action === "ADD_TO_FAVORITES") {
                        return(
                            <ListItem key={activity.id}>
                                <Typography component="p">
                                    <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>   aggiunto ai
                                    <NavLink to={'/favorites'}>Preferiti</NavLink>   da
                                    <NavLink to={'/profile'}>{user.username}</NavLink>
                                    <ListItemIcon>
                                        <Avatar src={`http://localhost:5001/${user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                    </ListItemIcon>   in data {activity.date}
                                </Typography>
                            </ListItem>)
                    }
                    if (activity.action === "ADD_REVIEW") {
                        return (
                            <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                                <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>   aggiunto alle
                                <NavLink to={'/recensioni'}>Recensioni</NavLink>   da
                                <NavLink to={'/profile'}>{user.username}</NavLink>
                                <ListItemIcon>
                                    <Avatar src={`http://localhost:5001/${user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                </ListItemIcon> con voto
                                <Rating name="read-only" value={activity.rating} readOnly />
                                in data {activity.date}
                            </ListItem>)
                    }
                    if (activity.action === "ADD_TO_WATCHED") {
                        return (
                            <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                                <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>
                                aggiunto ai
                                <NavLink to={'/watched'}>Film visti</NavLink> da
                                <NavLink to={'/profile'}>{user.username}</NavLink>
                                <ListItemIcon>
                                    <Avatar src={`http://localhost:5001/${user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                                </ListItemIcon>
                                in data {activity.date}
                            </ListItem>)
                    }
                })

            }
        </List>
    )
}
export default Activity;