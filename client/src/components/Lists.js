import {useParams} from "react-router-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, InputLabel, Input, IconButton, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DropDownMenu from "./DropDownMenu";
import {useEffect, useState} from "react";
import api from "../api";
import {useAuth} from "../context/authContext";
import {useNotification} from "../context/notificationContext";
import Carosello from "./Carosello";

function Lists(){

    const {username} = useParams();
    const {user} = useAuth();
    const {showNotification} = useNotification();
    useDocumentTitle(`Liste di ${username}`);

    const [listName, setListName] = useState("");
    const [lists, setLists] = useState([]);
    const [isAddListMenuOpen, setIsAddListMenuOpen] = useState(false);

    const createList = async (event) => {
        event.preventDefault();
        try{
            setIsAddListMenuOpen(false);
            setListName("");
            await api.post(`${process.env.REACT_APP_SERVER}/api/films/lists/create-list/${listName}`);
            showNotification(<strong>Lista <a href={`/${user.username}/${listName}/list`} style={{ color: 'green' }}>{listName}</a> creata</strong>, "success");
            showNotification(`Lista "${listName}" creata`);
        }catch(error){
            showNotification(error.response.data, "error");
            setListName("");
        }
    }

    const menuContent = [
        <Box>
            <InputLabel>Nome della lista</InputLabel>
            <Input type="string" value={listName} onChange={ (e) => setListName(e.target.value) } />
            <IconButton variant="contained" onClick={createList}>
                <AddIcon />
            </IconButton>
        </Box>
    ]

    useEffect(() => {
        api.get(`${process.env.REACT_APP_SERVER}/api/films/lists/get-lists/${username}`)
            .then(response => setLists(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [username, showNotification]);



    return (
        lists.length > 0 ?
            <Box>
                { user.username === username ? <Typography component="h1" variant="strong">Le tue liste</Typography> : <Typography component="h1">Liste di {username}</Typography> }
                { user.username === username && <DropDownMenu buttonContent="Crea una nuova lista" menuContent={menuContent} isMenuOpen={isAddListMenuOpen} setIsMenuOpen={setIsAddListMenuOpen} /> }

                {
                    lists.map((list) =>
                        list.films.length > 0 && <Carosello films={list.films} title={list.name} link={`/${username}/${list.name.replaceAll(" ", "-")}/list`} />   )
                }
            </Box>:
            user.username === username ?
                <Box>
                    <Typography component="h1">Non hai ancora creato nessuna lista</Typography>
                    <DropDownMenu buttonContent="Crea una nuova lista" menuContent={menuContent} isMenuOpen={isAddListMenuOpen} setIsMenuOpen={setIsAddListMenuOpen} />
                </Box>:
                <Typography component="h1">{username} non ha creato ancora nessuna lista</Typography>




    )
}

export default Lists;