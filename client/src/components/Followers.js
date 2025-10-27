import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box, Typography} from "@mui/material";
import UserCard from "./Cards/UserCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
function Followers() {

    const {showNotification} = useNotification();
    const {username} = useParams();
    useDocumentTitle(`Followers di ${username}`);

    const [followers, setFollowers] = useState([]);

    useEffect( () => {
        api.get(`${process.env.REACT_APP_SERVER}/api/user/${username}/get-followers`)
            .then(response => setFollowers(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    },[username, showNotification]);

    return(
        <Box sx={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            <Typography component="h1" variant="strong">Followers di {username}</Typography>
            {
                followers.map( user => <UserCard user={user} />)
            }
        </Box>
    )
}

export default Followers;
