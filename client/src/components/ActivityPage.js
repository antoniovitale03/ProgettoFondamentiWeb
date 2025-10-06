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
import {Link, NavLink, useParams} from "react-router-dom";
import ActivityElement from "./ActivityElement";
import useDocumentTitle from "./useDocumentTitle"

function ActivityPage(){

    const [activity, setActivity] = useState(null);
    const {user} = useAuth();
    const {username} = useParams();
    useDocumentTitle(`Attività di ${username}`)

    useEffect(() => {
        async function fetchActivity(){
            const response = await api.get(`http://localhost:5001/api/user/${username}/get-activity`);
            let activity = await response.data;
            setActivity(activity);
        }
        fetchActivity();
    }, [username])



    return(
        activity ?
                <List sx={{ width: '60%' }}>
                    {activity?.map(activity =>
                        <ActivityElement activity={activity} key={activity.id} />
                    )}
                </List>
                : <h1>Ancora nessun'attività per {username}</h1>
    )
}
export default ActivityPage;