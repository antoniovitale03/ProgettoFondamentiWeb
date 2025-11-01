import {useAuth} from "../context/authContext";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ListIcon from "@mui/icons-material/List";
import {Box, Button, Divider, ListItemIcon, MenuItem} from "@mui/material";
import Settings from '@mui/icons-material/Settings';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

import {Link} from "react-router-dom";
export default function UserMenu({ setIsUserMenuOpen }) {
    const {user, logout} = useAuth();
    const userMenuLinks = ['/', `/${user?.username}/profile`, `/${user?.username}/watched`, `/${user?.username}/favorites`, `/${user?.username}/reviews`, `/${user?.username}/watchlist`, `/${user?.username}/lists`];
    const userMenuNames = ["Home", "Il mio profilo", "Film visti", "I miei preferiti", "Le mie recensioni", "Film da guardare", "Le mie liste"];
    const userMenuIcons = [<HomeIcon />, <PersonIcon />, <VisibilityIcon />, <FavoriteIcon />, <RateReviewIcon/>, <WatchLaterIcon />, <ListIcon />];

    const settingsMenuNames = ["Modifica il mio profilo", "Modifica la mia password", "Elimina il tuo account"]
    const settingsMenuLinks = ["/settings/modify-profile", "/settings/modify-password", "/settings/delete-account"]
    return(
        <Box>
            {
                userMenuLinks.map((menuLink, index) =>
                    <MenuItem component={Link} to={menuLink} onClick={() => setIsUserMenuOpen(false)}>
                        <ListItemIcon>{userMenuIcons[index]}</ListItemIcon>{userMenuNames[index]}
                    </MenuItem>)
            }
            <Divider key="divider1"/>
            {
                settingsMenuLinks.map((menuLink, index) =>
                <MenuItem component={Link} to={menuLink} onClick={() => setIsUserMenuOpen(false)}>
                    <ListItemIcon><Settings /></ListItemIcon>{settingsMenuNames[index]}
                </MenuItem>)
            }
            <Divider key="divider2" />
            <MenuItem component={Button} key={10102} onClick={logout}>
                Logout
            </MenuItem>
        </Box>
    )
}