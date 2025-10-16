import api from "../api";
import {useEffect, useState} from "react";
import {Box, List} from "@mui/material";
import {useParams} from "react-router-dom";
import ActivityElement from "./ActivityElement";
import useDocumentTitle from "./hooks/useDocumentTitle"
import {useNotification} from "../context/notificationContext";

function ActivityPage(){
    const {showNotification} = useNotification()
    const [activity, setActivity] = useState(null);
    const {username} = useParams();
    useDocumentTitle(`Attività di ${username}`)

    useEffect(() => {
        api.get(`http://localhost:5001/api/user/${username}/get-activity`)
            .then( (response) => setActivity(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [username])


    return(
        activity ?
            <Box>
                <h1>Attività di {username}</h1>
                <List sx={{ width: '90%' }}>
                    {activity?.map(activity =>
                        <ActivityElement activity={activity} key={activity.id}/>
                    )}
                </List>
            </Box>

                : <h1>Ancora nessun'attività per {username}</h1>
    )
}
export default ActivityPage;