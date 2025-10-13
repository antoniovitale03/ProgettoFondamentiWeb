import api from "../api";
import {useEffect, useState} from "react";
import {Box, List} from "@mui/material";
import {useParams} from "react-router-dom";
import ActivityElement from "./ActivityElement";
import useDocumentTitle from "./hooks/useDocumentTitle"

function ActivityPage(){

    const [activity, setActivity] = useState(null);
    const {username} = useParams();
    useDocumentTitle(`Attività di ${username}`)

    useEffect(() => {
        const fetchActivity = async () => {
            const response = await api.get(`http://localhost:5001/api/user/${username}/get-activity`);
            let activity = await response.data;
            setActivity(activity);
        }
        fetchActivity();
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