import api from "../api";
import {useEffect, useState} from "react";
import {Avatar, Box} from "@mui/material";
import UserCard from "./Cards/UserCard";
import {useNotification} from "../context/notificationContext";
import {useParams} from "react-router-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {useAuth} from "../context/authContext";

function Following() {


    const {username} = useParams();
    const {showNotification} = useNotification();
    const {user} = useAuth();
    let myUsername = user.username;

    useDocumentTitle(`Seguiti di ${username}`);

    const [following, setFollowing] = useState([]);

    useEffect( () => {
             async function fetchFollowing(){
                 try{
                     const response = await api.get(`http://localhost:5001/api/user/${username}/get-following`);
                     setFollowing(response.data);
                 }catch(error){
                     showNotification(error.response.data, "error");
                 }
             }
             fetchFollowing();
         }, [username, showNotification]);


    const unfollow = async (userId, username) => {
        try{
            await api.delete(`http://localhost:5001/api/user/${userId}/unfollow`);
            showNotification(`Hai rimosso "${username}" dai seguiti`, "success");
            setFollowing(currentFollowing =>
                currentFollowing.filter(user => user.username !== username)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box sx={{ width: '50%', textAlign: 'center', margin: 'auto',  }}>
            <h1>Persone seguite da {username}</h1>
            {
                following.map( user =>
                <UserCard user={user} showRemoveButton={myUsername === username} onUnfollow={unfollow} />)
            }
        </Box>
    )
}

export default Following;