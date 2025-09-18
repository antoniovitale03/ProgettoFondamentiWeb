import {Container, Box, Button, Toolbar, AppBar} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import {Link} from "react-router-dom";
import * as React from "react";


function Footer() {

    let footerItems = [
        <Button component={Link} to="/about">About</Button>,
        <Button component={Link} to="/contact">Contact</Button>,
        <Button component={Link} to="/help">Help</Button>,
        <Button component={Link} to="https://github.com/antoniovitale03/ProgettoFondamentiWeb" target="_blank" rel="noreferrer">
            <GitHubIcon />
        </Button>,
        <Button component={Link} to="link di LinkedIn" target="_blank" rel="noreferrer">
            <LinkedInIcon />
        </Button>,
        <Button component={Link} to="link di Instagram" target="_blank" rel="noreferrer">
            <InstagramIcon />
        </Button>,
        <Button component={Link} to="link di Facebook" target="_blank" rel="noreferrer">
            <FacebookIcon />
        </Button>,
        <Button component={Link} to="link di X" target="_blank" rel="noreferrer">
            <XIcon />
        </Button>
    ]

    return (
        <AppBar position="static" sx= {{ backgroundColor:"lightsteelblue" }} >
            <Toolbar sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-evenly" }}>
                    { footerItems.map((footerItem) => footerItem) }
                </Box>
            </Toolbar>
            <p>© "nome progetto " {new Date().getFullYear()} Limited. All rights reserved.</p>
        </AppBar>

    )
}

export default Footer;