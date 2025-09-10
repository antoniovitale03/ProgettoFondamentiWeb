import {NavLink} from "react-router-dom";
import "../CSS/header-footer.css";
import {Container, Box} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import {Link} from "react-router-dom";


function Footer() {

    let footerItems = [
        <NavLink to="/about">About</NavLink>,
        <NavLink to="/contact">Contact</NavLink>,
        <NavLink to="/help">Help</NavLink>,
        <Link to="https://github.com/antoniovitale03/ProgettoFondamentiWeb" target="_blank" rel="noreferrer">
            <GitHubIcon />
        </Link>,
        <Link to="link di LinkedIn" target="_blank" rel="noreferrer">
            <LinkedInIcon />
        </Link>,
        <Link to="link di Instagram" target="_blank" rel="noreferrer">
            <InstagramIcon />
        </Link>
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