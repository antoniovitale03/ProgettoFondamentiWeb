import "../CSS/header.css"
import {NavLink} from "react-router-dom";
function DefaultHeader(){
    return(
        <header className="navigation-bar">
            <div className="logo">
                Mia App
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Home </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Chi Siamo </NavLink>
                    </li>
                    <li>
                        <NavLink to="/login">Accedi</NavLink>
                    </li>
                    <li>
                        <NavLink to="/registration">Crea un Account</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default DefaultHeader;