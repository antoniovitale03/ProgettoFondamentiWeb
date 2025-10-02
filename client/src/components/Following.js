import api from "../api";
import {useEffect, useState} from "react";
import {Avatar, Box} from "@mui/material";
import UserCard from "./Cards/UserCard";
import {useNotification} from "../context/notificationContext";
import {useParams} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
import {useAuth} from "../context/authContext";

function Following() {


    const {username} = useParams();
    const {showNotification} = useNotification();
    const {user} = useAuth();
    let a = user.username;

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
         }, [])


    const removeFromFollowing = async (userID) => {
        try{
            await api.delete(`http://localhost:5001/api/user/${username}/remove-from-following`);
            showNotification(`Hai rimosso ${username} dai seguiti`, "success");
            setFollowing(currentFollowing =>
                currentFollowing.filter(user => user._id !== userID)
            );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Box sx={{ width: '70%', textAlign: 'center', margin: 'auto' }}>
            {
                following.map( user =>
                <UserCard user={user} showRemoveButton={a === username} onRemove={removeFromFollowing} />)
            }
        </Box>
    )
}

export default Following;