// barra di navigazione
import { NavLink } from 'react-router-dom';// usiamo il componente NavLink invece che l'anchor tag <a>
// className={({ isActive }) => ...}: Questa è la magia di NavLink. Invece di una semplice stringa, passiamo una funzione all'attributo className.
// React Router chiama questa funzione e le passa un oggetto con una proprietà booleana: isActive.
// isActive è true se l'URL corrente corrisponde al to del NavLink.
// Usiamo un operatore ternario per restituire la classe 'nav-link active' se il link è attivo, altrimenti solo 'nav-link'

import {useAuth} from "../context/authContext";
import {Box, TextField, Button, Avatar, MenuItem, Toolbar, AppBar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from "../assets/images/AppLogo.png"
import DropDownMenu from "./DropDownMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {Link} from "react-router-dom";


function Header() {
    const {isLoggedIn, user, logout} = useAuth();
    const [title, setTitle] = useState("");

    const userMenuLinks = ["/profile", "/watched", "/favorites", "/recensioni", "/watchlist"]
    const userMenuNames = ["Il mio profilo", "La mia lista", "I miei preferiti", "Le mie recensioni", "Film da guardare"]

    const settingsMenuNames = ["Modifica il mio profilo", "Modifica la mia password", "Modifica il tuo avatar", "Elimina il tuo account"]
    const settingsMenuLinks = ["/settings/modify-profile", "/settings/modify-password", "/settings/modify-avatar", "/settings/delete-account"]

    let userMenuItems = [
        userMenuLinks.map((menuLink, index) => <MenuItem component={NavLink} key={index} to={menuLink}>{userMenuNames[index]}</MenuItem>),
        <MenuItem component={Button} key={10102} onClick={logout}>
        Logout
        </MenuItem>
    ]

    let settingsMenuItems = [
        settingsMenuLinks.map((menuLink, index) => <MenuItem component={NavLink} key={index} to={menuLink}>{settingsMenuNames[index]}</MenuItem>)
    ]


    const navigate = useNavigate();

    const handleSearch = async () => {
        try{
            let filmTitle = title.replaceAll(" ", "-");
            navigate(`/search/${filmTitle}`);
            setTitle("");
        }catch(error){
            setTitle("");
        }
    }

    let headerItems = [
        <Avatar alt="Travis Howard" src="../src/assets/images/logo512.png" />,
        <DropDownMenu buttonContent={user?.username} menuContent={userMenuItems}/>,
        <DropDownMenu buttonContent={<SettingsOutlinedIcon />} menuContent={settingsMenuItems}/>,
        <Button component={Link} to="/archivio">Archivio</Button>,
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button variant="contained" onClick={handleSearch}>
                <SearchIcon />
            </Button>
        </Box>,
        <Button variant="contained" color="success" href="/log-a-film" style={{ textDecoration: 'none', color: "white" }}> + Log </Button>,
        <Button href="/">
            <img src={logo} alt="logo" style={{height: '50px', width: 'auto' }}/>
        </Button>
    ]
    let notLoggedDefaultHeaderItems = [
        <Button variant="contained" color="success" href="/login"> Login </Button>,
        <Button variant="contained" color="success" href="/registration"> Crea un Account</Button>,
        <Button href="/">
            <img src={logo} alt="logo" style={{height: '50px', width: 'auto' }}/>
        </Button>
    ]

    return (
        <AppBar position="static" sx= {{ backgroundColor:"lightsteelblue" }} >
            <Toolbar sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-evenly" }}>
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