import {useParams} from "react-router-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import {Box, InputLabel, Input, IconButton} from "@mui/material";
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

    const createList = async (e) => {
        e.preventDefault();
        try{
            setIsAddListMenuOpen(false);
            setListName("");
            await api.post(`http://localhost:5001/api/films/lists/create-list/${listName}`);
            showNotification(<p>Lista <a href={`/${user.username}/${listName}/list`} style={{ color: 'green' }}>{listName}</a> creata</p>, "success");
            showNotification(`Lista "${listName}" creata`);
        }catch(error){
            showNotification(error.response.data, "error");
            setListName("");
        }
    }

    useEffect(() => {
        api.get(`http://localhost:5001/api/films/lists/get-lists/${username}`)
            .then(response => setLists(response.data))
            .catch(error => showNotification(error.response.data, "error"));
    }, [username, showNotification]);

    const menuContent = [
        <Box>
            <InputLabel>Nome della lista</InputLabel>
            <Input type="string" value={listName} onChange={ (e) => setListName(e.target.value) } />
            <IconButton variant="contained" onClick={createList}>
                <AddIcon />
            </IconButton>
        </Box>
    ]

    return (
        lists.length > 0 ?
            <Box>
                { user.username === username ? <h1>Le tue liste</h1> : <h1>Liste di {username}</h1> }
                { user.username === username && <DropDownMenu buttonContent="Crea una nuova lista" menuContent={menuContent} isMenuOpen={isAddListMenuOpen} setIsMenuOpen={setIsAddListMenuOpen} /> }

                {
                    lists.map((list) =>
                        list.films.length > 0 && <Carosello films={list.films} title={list.name} link={`/${username}/${list.name.replaceAll(" ", "-")}/list`} />   )
                }
            </Box>:
            user.username === username ?
                <Box>
                    <h1>Non hai ancora creato nessuna lista</h1>
                    <DropDownMenu buttonContent="Crea una nuova lista" menuContent={menuContent} isMenuOpen={isAddListMenuOpen} setIsMenuOpen={setIsAddListMenuOpen} />
                </Box>:
            <h1>{username} non ha creato ancora nessuna lista</h1>




    )
}

export default Lists;