import {Avatar, ListItem, ListItemIcon, Rating, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export default function Activity({ activity }){
    if (activity.action === "ADD_TO_WATCHLIST" && activity.user) {
        return (
            <ListItem key={activity._id}>
                <Typography component="p" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography component={Link} to={`/film/${activity.filmTitle.replaceAll(" ", "-")}/${activity.filmID}`} style={{ color: 'green', marginRight: 10}}>{activity.filmTitle}</Typography>
                    <Typography style={{ marginRight: 10 }}>aggiunto alla</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/watchlist`} style={{ color: 'green', marginRight: 10}}>Watchlist</Typography>
                    <Typography style={{ marginRight: 10 }}>da</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/profile`} style={{ color: 'green', marginRight: 10}}>{activity.user.username}</Typography>
                    <ListItemIcon>
                        <Avatar style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                    </ListItemIcon> {activity.timeAgo}
                </Typography>
            </ListItem>
        )
    }
    if (activity.action === "ADD_TO_FAVORITES" && activity.user) {
        return(
            <ListItem key={activity._id}>
                <Typography component="p" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography component={Link} to={`/film/${activity.filmTitle.replaceAll(" ", "-")}/${activity.filmID}`} style={{ color: 'green', marginRight: 10}}>{activity.filmTitle}</Typography>
                    <Typography style={{ marginRight: 10 }}>aggiunto ai</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/favorites`} style={{ color: 'green', marginRight: 10}}>Preferiti</Typography>
                    <Typography style={{ marginRight: 10 }}>da</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/profile`} style={{ color: 'green', marginRight: 10}}>{activity.user.username}</Typography>
                    <ListItemIcon>
                        <Avatar style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                    </ListItemIcon> {activity.timeAgo}
                </Typography>
            </ListItem>)
    }
    if (activity.action === "ADD_REVIEW" && activity.user) {
        return (
            <ListItem key={activity.id}>
                <Typography component="p" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography component={Link} to={`/film/${activity.filmTitle.replaceAll(" ", "-")}/${activity.filmID}`} style={{ color: 'green', marginRight: 10}}>{activity.filmTitle}</Typography>
                    <Typography style={{ marginRight: 10 }}>aggiunto alle</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/reviews`} style={{ color: 'green', marginRight: 10}}>Recensioni</Typography>
                    <Typography style={{ marginRight: 10 }}>da</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/profile`} style={{ color: 'green', marginRight: 10}}>{activity.user.username}</Typography>
                    <ListItemIcon>
                        <Avatar style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                    </ListItemIcon>
                    {activity.rating &&
                        <>
                            <Typography style={{ marginRight: 10 }}>con voto</Typography>
                            <Rating name="read-only" value={activity.rating} readOnly />
                        </>
                    }
                    {activity.timeAgo}
                </Typography>
            </ListItem>
        )
    }
    if (activity.action === "ADD_TO_WATCHED" && activity.user) {
        return (
            <ListItem key={activity.id}>
                <Typography component="p" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography component={Link} to={`/film/${activity.filmTitle.replaceAll(" ", "-")}/${activity.filmID}`} style={{ color: 'green', marginRight: 10}}>{activity.filmTitle}</Typography>
                    <Typography style={{ marginRight: 10 }}>aggiunto ai</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/watched`} style={{ color: 'green', marginRight: 10}}>Film visti</Typography>
                    <Typography style={{ marginRight: 10 }}>da</Typography>
                    <Typography component={Link} to={`/${activity.user.username}/profile`} style={{ color: 'green', marginRight: 10}}>{activity.user.username}</Typography>
                    <ListItemIcon>
                        <Avatar style={{width: "20px", height: "20px", borderRadius: "50%"}} />
                    </ListItemIcon>
                    {activity.timeAgo}
                </Typography>
            </ListItem>
        )
    }
}