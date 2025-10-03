import {Avatar, ListItem, ListItemIcon, Rating, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";

function ActivityElement({ activity }){
    if (activity.action === "ADD_TO_WATCHLIST") {
        return (
            <ListItem key={activity._id}>
                <Typography component="p">
                    <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>  aggiunto alla
                    <NavLink to={`/${activity.user.username}/watchlist`}> Watchlist</NavLink>   da
                    <NavLink to={`/${activity.user.username}/profile`}>{activity.user.username}</NavLink>
                    <ListItemIcon>
                        <Avatar src={`http://localhost:5001/${activity.user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                    </ListItemIcon>   in data {activity.date}
                </Typography>
            </ListItem>)
    }
    if (activity.action === "ADD_TO_FAVORITES") {
        return(
            <ListItem key={activity._id}>
                <Typography component="p">
                    <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>   aggiunto ai
                    <NavLink to={`/${activity.user.username}/favorites`}>Preferiti</NavLink>   da
                    <NavLink to={`/${activity.user.username}/profile`}>{activity.user.username}</NavLink>
                    <ListItemIcon>
                        <Avatar src={`http://localhost:5001/${activity.user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                    </ListItemIcon>   in data {activity.date}
                </Typography>
            </ListItem>)
    }
    if (activity.action === "ADD_REVIEW") {
        return (
            <ListItem key={activity.id} sx={ {display: "flex", justifyContent:"flex-start" }}>
                <NavLink to={`/film/${activity.filmTitle}/${activity.filmID}`}>{activity.filmTitle}</NavLink>   aggiunto alle
                <NavLink to={`/${activity.user.username}/reviews`}>Recensioni</NavLink>   da
                <NavLink to={`/${activity.user.username}/profile`}>{activity.user.username}</NavLink>
                <ListItemIcon>
                    <Avatar src={`http://localhost:5001/${activity.user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
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
                <NavLink to={`/${activity.user.username}/watched`}>Film visti</NavLink> da
                <NavLink to={`/${activity.user.username}/profile`}>{activity.user.username}</NavLink>
                <ListItemIcon>
                    <Avatar src={`http://localhost:5001/${activity.user.avatar_path}`} style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                </ListItemIcon>
                in data {activity.date}
            </ListItem>)
    }
}

export default ActivityElement;