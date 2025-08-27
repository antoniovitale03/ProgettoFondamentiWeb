// barra di navigazione
import { NavLink } from 'react-router-dom';// usiamo il componente NavLink invece che l'anchor tag <a>
// className={({ isActive }) => ...}: Questa è la magia di NavLink. Invece di una semplice stringa, passiamo una funzione all'attributo className.
// React Router chiama questa funzione e le passa un oggetto con una proprietà booleana: isActive.
// isActive è true se l'URL corrente corrisponde al to del NavLink.
// Usiamo un operatore ternario per restituire la classe 'nav-link active' se il link è attivo, altrimenti solo 'nav-link'

import "../CSS/header-footer.css"
import {useAuth} from "../context/authContext";
import {Container, Box, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import logo from "../assets/images/AppLogo.png"
import DropDownMenu from "./DropDownMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFilm} from "../context/filmContext";


function Header() {
    const {isLoggedIn, sleep} = useAuth();
    const {getFilmsFromSearch} = useFilm();
    const [film, setFilm] = useState("");

    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();
        try{
            await getFilmsFromSearch(film); //ora l'array dei film ottenuti dalla ricerca viene inserito nel contesto così altre componenti come SearchFilmResults e FilmCard possono accedere ai dati
            await sleep(2000);
            navigate(`/search/${film}`);
            setFilm("");
        }catch(error){
            setFilm("");
        }

    }


    return (
        <header className="navigation-bar">
            <Container>
                <Box>
                    {/*Header per utenti loggati*/}
                    {isLoggedIn && (<>
                            <nav>
                                <ul>
                                    <li>
                                        <DropDownMenu />
                                    </li>
                                    <li>
                                        <NavLink to="/archivio">Archivio</NavLink>
                                    </li>
                                    <li>
                                        <TextField id="film" value={film} onChange={ (e) => setFilm(e.target.value) } required/>
                                        <button onClick={handleSearch}>
                                            <SearchIcon />
                                        </button>
                                    </li>
                                    <li>
                                        <div className="logo">
                                            <NavLink to="/">
                                                <img src={logo} alt="logo" />
                                            </NavLink>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                    {/*Header per utenti non loggati*/}
                    {!isLoggedIn && (<>
                            <nav>
                                <ul>
                                    <li>
                                        <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Accedi</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/registration" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Crea un Account</NavLink>
                                    </li>
                                    <li className="logo">
                                        <a href="/">
                                            <img src={logo} alt="Logo"/>
                                        </a>
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