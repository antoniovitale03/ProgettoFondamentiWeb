// barra di navigazione
import { NavLink } from 'react-router-dom';// usiamo il componente NavLink invece che l'anchor tag <a>
// className={({ isActive }) => ...}: Questa è la magia di NavLink. Invece di una semplice stringa, passiamo una funzione all'attributo className.
// React Router chiama questa funzione e le passa un oggetto con una proprietà booleana: isActive.
// isActive è true se l'URL corrente corrisponde al to del NavLink.
// Usiamo un operatore ternario per restituire la classe 'nav-link active' se il link è attivo, altrimenti solo 'nav-link'

import "../CSS/header-footer.css"
import {useAuth} from "../context/authContext";
import {Container, Box} from "@mui/material";
import logo from "../assets/images/AppLogo.png"

function Header() {
    const {user, logout, isLoggedIn} = useAuth();
    return (
        <header className="navigation-bar">
            <Container>
                <Box>
                    {/*Header per utenti loggati*/}
                    {isLoggedIn && (<>
                            <div className="logo">
                                <NavLink to="/">
                                    <img src={logo} alt="logo" />
                                </NavLink>
                            </div>
                            <nav>
                                <ul>
                                    <li>
                                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> {user.username} </NavLink>
                                    </li>
                                    <li>
                                        <button onClick={logout} className="logout-button">Logout</button>
                                    </li>
                                    <li>
                                        <NavLink to="/delete-account" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Elimina Account</NavLink>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                    {/*Header per utenti non loggati*/}
                    {!isLoggedIn && (<>
                            <nav>
                                <ul>
                                    <li className="logo">
                                        <a href="/">
                                            <img src={logo} alt="Logo"/>
                                        </a>
                                    </li>
                                    <li>
                                        <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Accedi</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/registration" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Crea un Account</NavLink>
                                    </li>
                                </ul>
                            </nav>
                        </>
                        )}
                </Box>
            </Container>
        </header>
    )
}

export default Header;