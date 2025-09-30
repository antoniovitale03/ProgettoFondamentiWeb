
import { NavLink } from 'react-router-dom';

import {useAuth} from "../context/authContext";
import {Box, TextField, Button, Avatar, MenuItem, Toolbar, AppBar, ListItemIcon, Divider, Tooltip, Input} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person'
import ListIcon from '@mui/icons-material/List'
import FavoriteIcon from '@mui/icons-material/Favorite'
import RateReviewIcon from '@mui/icons-material/RateReview'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Settings from '@mui/icons-material/Settings'
import ArchiveIcon from '@mui/icons-material/Archive'
import BoltIcon from '@mui/icons-material/Bolt';
import {Link} from "react-router-dom"
import logo from "../assets/images/AppLogo.png"
import DropDownMenu from "./DropDownMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../context/notificationContext";
import * as React from "react";
import api from "../api";



function Header() {
    const {isLoggedIn, user, logout} = useAuth();
    const [title, setTitle] = useState("");
    const [friend, setFriend] = useState("");

    const navigate = useNavigate();
    const {showNotification} = useNotification();

    const handleSearch = async () => {
        try{
            let filmTitle = title.replaceAll(" ", "-");
            navigate(`/search/${filmTitle}`);
            setTitle("");
        }catch(error){
            showNotification(error.response.data, "error");
            setTitle("");
        }
    }

    const handleAddFriend = async () => {
        try{
            await api.get(`http://localhost:5001/api/users/${friend}/follow`);

        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const userMenuLinks = ["/profile", "/watched", "/favorites", "/recensioni", "/watchlist"];
    const userMenuNames = ["Il mio profilo", "La mia lista", "I miei preferiti", "Le mie recensioni", "Film da guardare"];
    const userMenuIcons = [<PersonIcon />, <ListIcon />, <FavoriteIcon />, <RateReviewIcon/>, <VisibilityIcon/>];


    const settingsMenuNames = ["Modifica il mio profilo", "Modifica la mia password", "Modifica il mio avatar", "Elimina il tuo account"]
    const settingsMenuLinks = ["/settings/modify-profile", "/settings/modify-password", "/settings/modify-avatar", "/settings/delete-account"]

    let addAfriend = (
        <>
            <Input type="string" value={friend} onChange={(event) => setFriend(event.target.value)}/>
            <Button variant="contained" onClick={handleAddFriend}>
                <SearchIcon />
            </Button>
        </>
        )



    let menuItems = [
        userMenuLinks.map((menuLink, index) =>
            <MenuItem component={NavLink} key={index} to={menuLink}>
                <ListItemIcon>{userMenuIcons[index]}</ListItemIcon>{userMenuNames[index]}
            </MenuItem>),
        <Divider />,
        settingsMenuLinks.map((menuLink, index) =>
            <MenuItem component={NavLink} key={index} to={menuLink}>
                <ListItemIcon><Settings /></ListItemIcon>{settingsMenuNames[index]}
            </MenuItem>),
        <Divider />,
        <MenuItem component={Button} key={10102} onClick={logout}>
        Logout
        </MenuItem>
    ]


    let headerItems = [
        <DropDownMenu buttonContent={<Tooltip title={user?.username}><Avatar src={`http://localhost:5001/${user?.avatar_path}`} /></Tooltip>} menuContent={menuItems}/>,
        <Button component={Link} to="/activity"><Tooltip title="Activity"><BoltIcon/></Tooltip></Button>,
        <NavLink to="/archivio"><Tooltip title="Archivio film"><ArchiveIcon/></Tooltip></NavLink>,
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button variant="contained" onClick={handleSearch}>
                <SearchIcon />
            </Button>
        </Box>,
        <DropDownMenu buttonContent="Aggiungi un amico" menuContent={addAfriend}></DropDownMenu>,
        <Button href="/">
            <img src={logo} alt="logo" style={{ height: '50px', width: 'auto' }}/>
        </Button>
    ]
    let notLoggedDefaultHeaderItems = [
        <Button variant="contained" color="success" href="/login"> Login </Button>,
        <Button variant="contained" color="success" href="/registration"> Crea un Account</Button>,
        <Button href="/">
            <img src={logo} alt="logo" style={{ height: '50px', width: 'auto' }}/>
        </Button>
    ]

    return (
        <AppBar position="static" sx= {{ backgroundColor:"lightsteelblue" }} >
            <Toolbar sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-evenly", flexGrow: 1 }}>
                    {
                        isLoggedIn ? headerItems.map((headerItem) => headerItem) :
                        notLoggedDefaultHeaderItems.map((headerItem) => headerItem)
                    }
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header;