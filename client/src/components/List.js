import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api";
import {Grid, Stack} from "@mui/material";
import FilmCard from "./Cards/FilmCard";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {useNotification} from "../context/notificationContext";
import {useAuth} from "../context/authContext";

function List(){

    let {username, listName} = useParams();
    const {user} = useAuth();
    listName = listName.replaceAll("-", " ");

    const {showNotification} = useNotification();
    const [list, setList] = useState([]);
    useDocumentTitle(`Lista "${listName}" di ${username}`)

    useEffect( () => {
        const getList = async () => {
            const response = await api.get(`http://localhost:5001/api/films/lists/get-list/${username}/${listName}`);
            const data = await response.data;
            setList(data);
        }
        getList();
        }, [username, listName])

    const removeFromList = async (filmID, filmTitle) => {
        try{
            await api.delete(`http://localhost:5001/api/films/lists/remove-from-list/${filmID}/${listName}`);
            showNotification(<p>"{filmTitle}" rimosso dalla lista {listName}</p>)
            setList( currentList => currentList.filter( film => film._id !== filmID) );
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    return(
        <Stack spacing={7}>
            <h1>Lista "{listName}" di {username}</h1>
            <p>{list.length} film</p>

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

export default List;