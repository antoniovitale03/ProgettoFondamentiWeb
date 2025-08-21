// barra di navigazione
import { NavLink } from 'react-router-dom';// usiamo il componente NavLink invece che l'anchor tag <a>
// className={({ isActive }) => ...}: Questa è la magia di NavLink. Invece di una semplice stringa, passiamo una funzione all'attributo className.
// React Router chiama questa funzione e le passa un oggetto con una proprietà booleana: isActive.
// isActive è true se l'URL corrente corrisponde al to del NavLink.
// Usiamo un operatore ternario per restituire la classe 'nav-link active' se il link è attivo, altrimenti solo 'nav-link'

import "../CSS/header.css"
import {useAuth} from "../context/authContext";

function Header() {
    const {user, logout, isLoggedIn} = useAuth();
    return (
        <header className="navigation-bar">
            <div className="logo">
                Mia App
            </div>
            {isLoggedIn && (<>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Home </NavLink>
                            </li>
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
            {!isLoggedIn && (<>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Home </NavLink>
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
        </header>
    )
}

export default Header;