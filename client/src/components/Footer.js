import {Button, Toolbar, AppBar, IconButton, Typography} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import {Link} from "react-router-dom";


export default function Footer() {
    return (
        <AppBar position="static" sx={{ backgroundColor:"#52796f" }} >
            <Toolbar sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-evenly", marginTop: '0.25vw' }}>
                    <Button sx={{color:"#354f52"}} component={Link} to="/about">About</Button>
                    <Button sx={{color:"#354f52"}} component={Link} to="/contact">Contact</Button>
                    <Button sx={{color:"#354f52"}} component={Link} to="/help">Help</Button>
                    <IconButton component={Link} to="https://github.com/antoniovitale03/ProgettoFondamentiWeb" target="_blank" rel="noreferrer">
                        <GitHubIcon />
                    </IconButton>
                    <IconButton component={Link} to="link di LinkedIn" target="_blank" rel="noreferrer">
                        <LinkedInIcon />
                    </IconButton>
                    <IconButton component={Link} to="link di Instagram" target="_blank" rel="noreferrer">
                        <InstagramIcon />
                    </IconButton>
                    <IconButton component={Link} to="link di Facebook" target="_blank" rel="noreferrer">
                        <FacebookIcon />
                    </IconButton>
                    <IconButton component={Link} to="link di X" target="_blank" rel="noreferrer">
                        <XIcon />
                    </IconButton>
            </Toolbar>
            <Typography component="p" sx={{ margin: '1vw 2vw 2vw 2vw' }}>
                © CineSync {new Date().getFullYear()} Limited. All rights reserved.
            </Typography>
        </AppBar>

    )
}