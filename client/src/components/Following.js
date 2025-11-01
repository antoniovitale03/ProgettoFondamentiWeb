import api from "../api";
import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import UserCard from "./Cards/UserCard";
import {useNotification} from "../context/notificationContext";
import {useParams} from "react-router-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {useAuth} from "../context/authContext";
import {Link} from "react-router-dom";

export default function Following() {

    const {username} = useParams();
    const {showNotification} = useNotification();
    const {user} = useAuth();
    let myUsername = user.username;

    useDocumentTitle(`Seguiti di ${username}`);

    const [following, setFollowing] = useState([]);


    const unfollow = async (userId, username) => {
        try{
            await api.delete(`${process.env.REACT_APP_SERVER}/api/user/${userId}/unfollow`);
            showNotification(<strong>Hai rimosso <Link to={`/${username}/profile`} style={{ color: 'green' }}>{username}</Link> dai seguiti</strong>, "success");
            setFollowing(currentFollowing =>
                currentFollowing.filter(user => user.username !== username)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect( () => {
        api.get(`${process.env.REACT_APP_SERVER}/api/user/${username}/get-following`)
            .then(response => setFollowing(response.data))
            .catch(error => showNotification(error.response.data, "error"));
         }, [username, showNotification]);



    return(
        <Box sx={{ width: '50%', textAlign: 'center', margin: 'auto',  }}>
            <Typography component="h1" variant="strong">Persone seguite da {username}</Typography>
            {
                following.map( user =>
                <UserCard user={user} showRemoveButton={myUsername === username} onUnfollow={unfollow} />)
            }
        </Box>
    )
}