import api from "../api";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";

function Following() {

    const [following, setFollowing] = useState([]);

    useEffect( () => {
             async function fetchFollowing(){
                 const response = await api.get('http://localhost:5001/api/user/get-following');
                 setFollowing(response.data);
             }
             fetchFollowing();
         }, [following])


    return(
        <Box>
            {following.map( user => <p key={user._id}>{user.username}</p>)}
        </Box>
    )
}

export default Following;