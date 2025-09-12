import {NavLink} from "react-router-dom";
import "../CSS/header-footer.css";
import {Container, Box, Button} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import {Link} from "react-router-dom";


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
        <footer className="navigation-bar">
            <Container>
                <Box>
                    <nav>
                        <ul>
                            { footerItems.map( (footerItem) => <li>{footerItem}</li> ) }
                        </ul>
                    </nav>
                    <p>© "nome progetto " {new Date().getFullYear()} Limited. All rights reserved.</p>
                </Box>
                </Container>
        </footer>
    )
}

export default Footer;