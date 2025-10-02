import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Box} from "@mui/material";
import UserCard from "./Cards/UserCard";

function Followers() {

    const {showNotification} = useNotification();
    const {user} = useAuth();
    const {username} = useParams();

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
    } )

    return(
        <Box sx={{ width: '70%', textAlign: 'center', margin: 'auto' }}>
            {
                followers.map( user => <UserCard user={user} />)
            }
        </Box>
    )
}

export default Followers;
