import {useAuth} from "../../context/authContext";
import {Avatar, Toolbar, Tooltip, AppBar, Button} from "@mui/material";
import ArchiveIcon from '@mui/icons-material/Archive'
import BoltIcon from '@mui/icons-material/Bolt';
import {Link} from "react-router-dom";
import UserMenu from "./UserMenu";
import logo from "../../assets/images/logo.png";
import SearchFilm from "./SearchFilm";
import SearchFriend from "./SearchFriend";

export default function Header() {

    const {isLoggedIn, user} = useAuth();

    let headerItems = [
        <UserMenu />,
        <Link to={`/${user?.username}/activity`}><Tooltip title="Attività"><BoltIcon sx={{color:"#354f52"}}/></Tooltip></Link>,
        <Link to="/archive"><Tooltip title="Archivio film"><ArchiveIcon sx={{color:"#354f52"}}/></Tooltip></Link>,
        <SearchFilm />,
        <SearchFriend />,
        <Link to="/">
            <Avatar src={logo} style={{ height: '50px', width: 'auto' }}/>
        </Link>
    ]
    
    let notLoggedHeaderItems = [
        <Button component={Link} variant="contained" color="success" to="/login"> Login </Button>,
        <Button component={Link} variant="contained" color="success" to="/registration"> Crea un Account</Button>,
        <Link to="/archive"><Tooltip title="Archivio film"><ArchiveIcon sx={{color:"#354f52"}}/></Tooltip></Link>,
        <SearchFilm />,
        <Link to="/">
            <Avatar src={logo} style={{ height: '50px', width: 'auto' }}/>
        </Link>
    ]

    return (
        <AppBar position="fixed" sx= {{ backgroundColor:"#52796f", height:"5vw" }} >
            <Toolbar sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-evenly", marginTop: '0.7vw' }}>
                    {
                        isLoggedIn ? headerItems.map((headerItem) => headerItem) :
                        notLoggedHeaderItems.map((headerItem) => headerItem)
                    }
            </Toolbar>
        </AppBar>
    )
}