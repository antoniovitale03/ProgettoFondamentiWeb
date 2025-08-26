import {NavLink} from "react-router-dom";
import "../CSS/header-footer.css";
import {Container, Box, IconButton} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import {useAuth} from "../context/authContext";
function Footer() {
    const {isLoggedIn} = useAuth();
    return (
        <footer className="navigation-bar">
            <Container>
                <Box>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/about">About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact">Contact</NavLink>
                            </li>
                            {isLoggedIn ? (
                               <li>
                                   <NavLink to="/help">Help</NavLink>
                               </li>
                            ) : null}
                            {/*link App esterne*/}
                            <li>
                                <IconButton component="a" href="https://github.com/antoniovitale03/ProgettoFondamentiWeb" target="_blank" rel="noreferrer">
                                    <GitHubIcon />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton component="a" href="link di Linkedin" target="_blank" rel="noreferrer">
                                    <LinkedInIcon />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton component="a" href="link di instagram" target="_blank" rel="noreferrer">
                                    <InstagramIcon />
                                </IconButton>
                            </li>
                        </ul>
                    </nav>
                    <p>© "nome progetto " {new Date().getFullYear()} Limited. All rights reserved.</p>
                </Box>
                </Container>
        </footer>
    )
}

export default Footer;