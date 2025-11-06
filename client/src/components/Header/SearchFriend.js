import {Box, IconButton, Input, InputLabel, Typography} from "@mui/material";
import DropDownMenu from "../DropDownMenu";
import api from "../../api";
import {Link} from "react-router-dom";
import {useState} from "react";
import {useNotification} from "../../context/notificationContext";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchFriend(){

    const [friendUsername, setFriendUsername] = useState("");
    const {showNotification} = useNotification();
    const [isAddFriendMenuOpen, setIsAddFriendMenuOpen] = useState(false);

    const sendFriendRequest = (event) => {
        event.preventDefault();
        setIsAddFriendMenuOpen(false);
        setFriendUsername("");
        api.post(`${process.env.REACT_APP_SERVER}/api/user/${friendUsername}/follow`)
            .then(() => showNotification(<strong>Hai appena aggiunto <Link to={`/${friendUsername}/profile`} style={{ color: 'green' }}>{friendUsername}</Link> come amico</strong>, "success"))
            .catch(error => showNotification(error.response.data, "error"));
    }

    let addAfriendMenu =
        <Box component="form" onSubmit={sendFriendRequest}>
            <InputLabel>Username</InputLabel>
            <Input type="search" value={friendUsername} onChange={(event) => setFriendUsername(event.target.value)}/>
            <IconButton variant="contained" onClick={sendFriendRequest}>
                <SearchIcon/>
            </IconButton>
        </Box>

    return(
        <DropDownMenu buttonContent={<Typography component="p" sx={{color:"#354f52", marginTop:"5px"}}>Aggiungi un amico </Typography>}
                      menuContent={addAfriendMenu} isMenuOpen={isAddFriendMenuOpen} setIsMenuOpen={setIsAddFriendMenuOpen} />
    )
}