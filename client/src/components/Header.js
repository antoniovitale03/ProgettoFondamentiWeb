import {useAuth} from "../context/authContext";
import {Box, Typography, TextField, Button, Avatar, Toolbar, Tooltip, Input, InputLabel, IconButton, AppBar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive'
import BoltIcon from '@mui/icons-material/Bolt';
import DropDownMenu from "./DropDownMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../context/notificationContext";
import api from "../api";
import {Link} from "react-router-dom";
import UserMenu from "../components/UserMenu";
import logo from "../assets/images/logo.png";

export default function Header() {
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
        api.post(`${process.env.REACT_APP_SERVER}/api/user/${friendUsername}/follow`)
            .then(() => showNotification(<strong>Hai appena aggiunto <Link to={`/${friendUsername}/profile`} style={{ color: 'green' }}>{friendUsername}</Link> come amico</strong>, "success"))
            .catch(error => showNotification(error.response.data, "error"));
    }

    let addAfriendMenu = [
        <Box>
            <InputLabel>Username</InputLabel>
            <Input type="string" value={friendUsername} onChange={(event) => setFriendUsername(event.target.value)}/>
            <IconButton variant="contained" onClick={sendFriendRequest}>
                <SearchIcon/>
            </IconButton>
        </Box>
        ]

    let headerItems = [
        <DropDownMenu buttonContent={<Tooltip title={user?.username}><Avatar/></Tooltip>}
                      menuContent={<UserMenu setIsUserMenuOpen={setIsUserMenuOpen} />} isMenuOpen={isUserMenuOpen} setIsMenuOpen={setIsUserMenuOpen} />,
        <Button component={Link} to={`/${user?.username}/activity`}><Tooltip title="Attività"><BoltIcon sx={{color:"#354f52"}}/></Tooltip></Button>,
        <Button component={Link} to="/archive"><Tooltip title="Archivio film"><ArchiveIcon sx={{color:"#354f52"}}/></Tooltip></Button>,
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button sx={{backgroundColor:"#354f52",marginTop:"8px"}} variant="contained" onClick={handleSearch}>
                <SearchIcon/>
            </Button>
        </Box>,
        <DropDownMenu buttonContent={<Typography component="p" sx={{color:"#354f52", marginTop:"5px"}}>Aggiungi un amico </Typography>} menuContent={addAfriendMenu} isMenuOpen={isAddFriendMenuOpen} setIsMenuOpen={setIsAddFriendMenuOpen} />,
        <Button component={Link} to="/">
            <Avatar src={logo} style={{ height: '50px', width: 'auto' }}/>
        </Button>
    ]
    
    let notLoggedDefaultHeaderItems = [
        <Button component={Link} to="/archive">
            <ArchiveIcon sx={{color:"#354f52"}} />
        </Button>,
        <Button component={Link} variant="contained" color="success" to="/login"> Login </Button>,
        <Button component={Link} variant="contained" color="success" to="/registration"> Crea un Account</Button>,
        <Box component="form" onSubmit={handleSearch}>
            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
            <Button sx={{backgroundColor:"#354f52",marginTop:"8px"}} variant="contained" onClick={handleSearch}>
                <SearchIcon />
            </Button>
        </Box>,
        <Button component={Link} to="/">
            <Avatar src={logo} alt="" style={{ height: '50px', width: 'auto' }}/>
        </Button>
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