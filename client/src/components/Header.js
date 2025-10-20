import {useAuth} from "../context/authContext";
import {Box, TextField, Button, Avatar, Toolbar, Tooltip, Input, InputLabel, IconButton, AppBar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive'
import BoltIcon from '@mui/icons-material/Bolt';
import DropDownMenu from "./DropDownMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import UserMenu from "../components/UserMenu";


function Header() {
    const {isLoggedIn, user} = useAuth();
    const [title, setTitle] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAddFriendMenuOpen, setIsAddFriendMenuOpen] = useState(false);

    const navigate = useNavigate();
    const {showNotification} = useNotification();

    const handleSearch = async () => {
        try{
            navigate(`/search/${title.replaceAll(" ", "-")}`);
            setTitle("");
        }catch(error){
            showNotification(error.response.data, "error");
            setTitle("");
        }
    }

    const sendFriendRequest = () => {
        setIsAddFriendMenuOpen(false);
        setFriendUsername("");
        api.post(`http://localhost:5001/api/user/${friendUsername}/follow`)
            .then(() => showNotification(<strong>Hai appena aggiunto <a href={`/${friendUsername}/profile`} style={{ color: 'green' }}>{friendUsername}</a> come amico</strong>, "success"))
            .catch(error => showNotification(error.response.data, "error"));
    }

    let addAfriendMenu = [
        <Box>
            <InputLabel>Username</InputLabel>
            <Input type="string" value={friendUsername} onChange={(event) => setFriendUsername(event.target.value)}/>
            <IconButton variant="contained" onClick={sendFriendRequest}>
                <SearchIcon />
            </IconButton>
        </Box>
        ]

    let headerItems = [
        <DropDownMenu buttonContent={<Tooltip title={user?.username}><Avatar src={`http://localhost:5001${user?.avatar_path}`}/></Tooltip>}
                      menuContent={<UserMenu setIsUserMenuOpen={setIsUserMenuOpen} />} isMenuOpen={isUserMenuOpen} setIsMenuOpen={setIsUserMenuOpen} />,
        <IconButton href={`/${user?.username}/activity`}><Tooltip title="Attività"><BoltIcon/></Tooltip></IconButton>,
        <IconButton href="/archive"><Tooltip title="Archivio film"><ArchiveIcon/></Tooltip></IconButton>,
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button variant="contained" onClick={handleSearch}>
                <SearchIcon />
            </Button>
        </Box>,
        <DropDownMenu buttonContent="Aggiungi un amico" menuContent={addAfriendMenu} isMenuOpen={isAddFriendMenuOpen} setIsMenuOpen={setIsAddFriendMenuOpen} />,
        <IconButton href="/">
            <Avatar src="https://storage.freeicon.com/free-film-icon-Op4bXIvv6I6p" style={{ height: '50px', width: 'auto' }}/>
        </IconButton>
    ]
    
    let notLoggedDefaultHeaderItems = [
        <IconButton href="/archive">
            <ArchiveIcon />
        </IconButton>,
        <Button variant="contained" color="success" href="/login"> Login </Button>,
        <Button variant="contained" color="success" href="/registration"> Crea un Account</Button>,
        <IconButton href="/">
            <Avatar src="https://storage.freeicon.com/free-film-icon-Op4bXIvv6I6p" alt="" style={{ height: '50px', width: 'auto' }}/>
        </IconButton>
    ]

    return (
        <AppBar position="static" sx= {{ backgroundColor:"#52796f", height:"90px" }} >
            <Toolbar>
                <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-evenly", flexGrow: 1, marginTop: '0.25%' }}>
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