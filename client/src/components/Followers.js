import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box} from "@mui/material";
import UserCard from "./Cards/UserCard";
import useDocumentTitle from "./useDocumentTitle";
function Followers() {

    const {showNotification} = useNotification();
    const {username} = useParams();
    useDocumentTitle(`Followers di ${username}`);

    const [followers, setFollowers] = useState([]);

    useEffect( () => {
        async function fetchFollowers(){
            try{
                const response = await api.get(`http://localhost:5001/api/user/${username}/get-followers`);
                setFollowers(response.data);
            }catch(error){
                showNotification(error.response.data, "error");
            }
        }
        fetchFollowers();
    },[username]);

    return(
        <Box sx={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            <h1>Followers di {username}</h1>
            {
                followers.map( user => <UserCard user={user} />)
            }
        </Box>
    )
}

export default Followers;
