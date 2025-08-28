import {NavLink} from "react-router-dom";
import "../CSS/header-footer.css";
import {Container, Box} from "@mui/material";
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
                                <a href="https://github.com/antoniovitale03/ProgettoFondamentiWeb" target="_blank" rel="noreferrer">
                                    <GitHubIcon />
                                </a>
                            </li>
                            <li>
                                <a href="link di LinkedIn" target="_blank" rel="noreferrer">
                                    <LinkedInIcon />
                                </a>
                            </li>
                            <li>
                                <a href="link di Instagram" target="_blank" rel="noreferrer">
                                    <InstagramIcon />
                                </a>
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