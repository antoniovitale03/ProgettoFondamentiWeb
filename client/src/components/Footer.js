import {NavLink} from "react-router-dom";
import "../CSS/header-footer.css";
import {Container, Box} from "@mui/material";
import {useAuth} from "../context/authContext"
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
                                <a href="https://github.com/antoniovitale03/ProgettoFondamentiWeb" target="_blank" rel="noreferrer">GitHub</a>
                            </li>
                            <li>
                                <a href="qualcosa">LinkedIn</a>
                            </li>
                            <li>
                                <a href="qualcosa">Instagram</a>
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