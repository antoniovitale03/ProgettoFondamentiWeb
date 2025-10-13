import {useAuth} from "../context/authContext";
import {
    Box,
    TextField,
    Button,
    Avatar,
    MenuItem,
    Toolbar,
    AppBar,
    ListItemIcon,
    Divider,
    Tooltip,
    Input,
    InputLabel,
    IconButton
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person'
import ListIcon from '@mui/icons-material/List'
import FavoriteIcon from '@mui/icons-material/Favorite'
import RateReviewIcon from '@mui/icons-material/RateReview'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Settings from '@mui/icons-material/Settings'
import ArchiveIcon from '@mui/icons-material/Archive'
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
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
    const [friendUsername, setFriendUsername] = useState(""); //username dell'amico
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAddFriendMenuOpen, setIsAddFriendMenuOpen] = useState(false);


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

    const sendFriendRequest = async () => {
        try{
            setIsAddFriendMenuOpen(false);
            setFriendUsername("");
            await api.post(`http://localhost:5001/api/user/${friendUsername}/follow`);
            showNotification(<p>Hai appena aggiunto <a href={`/${friendUsername}/profile`}>{friendUsername}</a> come amico</p>, "success");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }

    const userMenuLinks = ['/', `/${user?.username}/profile`, `/${user?.username}/watched`, `/${user?.username}/favorites`, `/${user?.username}/reviews`, `/${user?.username}/watchlist`, `/${user?.username}/lists`];
    const userMenuNames = ["Home", "Il mio profilo", "Film visti", "I miei preferiti", "Le mie recensioni", "Film da guardare", "Le mie liste"];
    const userMenuIcons = [<HomeIcon />, <PersonIcon />, <VisibilityIcon />, <FavoriteIcon />, <RateReviewIcon/>, <VisibilityIcon/>, <ListIcon />];

    const settingsMenuNames = ["Modifica il mio profilo", "Modifica la mia password", "Modifica il mio avatar", "Elimina il tuo account"]
    const settingsMenuLinks = ["/settings/modify-profile", "/settings/modify-password", "/settings/modify-avatar", "/settings/delete-account"]

    let addAfriendMenu = [
        <Box>
            <InputLabel>Username</InputLabel>
            <Input type="string" value={friendUsername} onChange={(event) => setFriendUsername(event.target.value)}/>
            <IconButton variant="contained" onClick={sendFriendRequest}>
                <SearchIcon />
            </IconButton>
        </Box>

        ]


    let userMenu = [
        userMenuLinks.map((menuLink, index) =>
            <MenuItem component={Link} to={menuLink} onClick={() => setIsUserMenuOpen(false)}>
                <ListItemIcon>{userMenuIcons[index]}</ListItemIcon>{userMenuNames[index]}
            </MenuItem>),
        <Divider key="divider1"/>,
        settingsMenuLinks.map((menuLink, index) =>
            <MenuItem component={Link} to={menuLink} onClick={() => setIsUserMenuOpen(false)}>
                <ListItemIcon><Settings /></ListItemIcon>{settingsMenuNames[index]}
            </MenuItem>),
        <Divider key="divider2" />,
        <MenuItem component={Button} key={10102} onClick={logout}>
        Logout
        </MenuItem>
    ]


    let headerItems = [
        <DropDownMenu buttonContent={<Tooltip title={user?.username}><Avatar src={`http://localhost:5001${user?.avatar_path}`}/></Tooltip>}
                      menuContent={userMenu} isMenuOpen={isUserMenuOpen} setIsMenuOpen={setIsUserMenuOpen} />,
        <Button component={Link} to={`/${user?.username}/activity`}><Tooltip title="Attività"><BoltIcon/></Tooltip></Button>,
        <Button component={Link} to="/archive"><Tooltip title="Archivio film"><ArchiveIcon/></Tooltip></Button>,
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button variant="contained" onClick={handleSearch}>
                <SearchIcon />
            </Button>
        </Box>,
        <DropDownMenu buttonContent="Aggiungi un amico" menuContent={addAfriendMenu} isMenuOpen={isAddFriendMenuOpen} setIsMenuOpen={setIsAddFriendMenuOpen} />,
        <Button component={Link} to="/">
            <Avatar src={logo} style={{ height: '50px', width: 'auto' }}/>
        </Button>
    ]
    
    let notLoggedDefaultHeaderItems = [
        <IconButton component={Link} to={"/archive"}>
            <ArchiveIcon />
        </IconButton>,
        <Button variant="contained" color="success" href="/login"> Login </Button>,
        <Button variant="contained" color="success" href="/registration"> Crea un Account</Button>,
        <IconButton component={Link} to={"/"}>
            <Avatar src={logo} alt="logo" style={{ height: '50px', width: 'auto' }}/>
        </IconButton>
    ]

    return (
        <AppBar position="static" sx={{ backgroundColor:"lightsteelblue" }} >
            <Toolbar>
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