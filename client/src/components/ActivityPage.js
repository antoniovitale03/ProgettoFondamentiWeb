import api from "../api";
import {useEffect, useState} from "react";
import {Box, List, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import Activity from "./Activity";
import useDocumentTitle from "./hooks/useDocumentTitle"
import {useNotification} from "../context/notificationContext";

function ActivityPage(){
    const {showNotification} = useNotification();
    const [activity, setActivity] = useState(null);
    const {username} = useParams();
    useDocumentTitle(`Attività di ${username}`);

    useEffect(() => {
        api.get(`http://localhost:5001/api/user/${username}/get-activity`)
            .then( (response) => setActivity(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [username, showNotification])

    return(
        activity ?
            <Box>
                <Typography component="h1" variant="strong">Attività di {username}</Typography>
                <List sx={{ width: '90%' }}>
                    {activity?.map(activity =>
                        <Activity activity={activity} key={activity.id}/>
                    )}
                </List>
            </Box>
                : <Typography component="h1" variant="strong">Ancora nessun'attività per {username}</Typography>
    )
}
export default ActivityPage;