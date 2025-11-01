import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {Grid, Stack, Typography} from "@mui/material";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {useNotification} from "../context/notificationContext";
import {useAuth} from "../context/authContext";

export default function List(){

    let {username, listName} = useParams();
    const {user} = useAuth();
    listName = listName.replaceAll("-", " ");

    const {showNotification} = useNotification();
    const [list, setList] = useState([]);
    useDocumentTitle(`Lista "${listName}" di ${username}`)

    const removeFromList = async (filmID, filmTitle) => {
        try{
            await api.delete(`${process.env.REACT_APP_SERVER}/api/films/lists/remove-from-list/${filmID}/${listName}`);
            showNotification(<strong>"{filmTitle}" rimosso dalla lista "{listName}"</strong>)
            setList( currentList => currentList.filter( film => film._id !== filmID) );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    useEffect( () => {
        api.get(`${process.env.REACT_APP_SERVER}/api/films/lists/get-list/${username}/${listName}`)
            .then(response => setList(response.data))
            .catch(error => showNotification(error.response.data, "error"));
        }, [username, listName, showNotification]);



    return(
        <Stack spacing={7}>
            <Typography component="h1">Lista "{listName}" di {username}</Typography>
            <Typography componenet="p">{list.length} film</Typography>

            <Grid container spacing={2}>
                {
                    list.map( film =>
                        <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                            <FilmCard film={film} showRemoveButton={user.username === username} onRemove={removeFromList}/>
                        </Grid>

                    )}
            </Grid>

        </Stack>
    )
}