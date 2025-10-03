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
import ActivityElement from "./ActivityElement";

function ActivityPage(){

    const [activity, setActivity] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        async function fetchActivity(){
            const response = await api.get('http://localhost:5001/api/user/get-activity');
            let activity = await response.data;
            setActivity(activity);
        }
        fetchActivity();
    }, [])



    return(
        <List sx={{ width: '60%' }}>
            {
                activity?.map(activity =>
                    <ActivityElement activity={activity} key={activity.id} />
                )
            }
        </List>
    )
}
export default ActivityPage;