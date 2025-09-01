// barra di navigazione
import { NavLink } from 'react-router-dom';// usiamo il componente NavLink invece che l'anchor tag <a>
// className={({ isActive }) => ...}: Questa è la magia di NavLink. Invece di una semplice stringa, passiamo una funzione all'attributo className.
// React Router chiama questa funzione e le passa un oggetto con una proprietà booleana: isActive.
// isActive è true se l'URL corrente corrisponde al to del NavLink.
// Usiamo un operatore ternario per restituire la classe 'nav-link active' se il link è attivo, altrimenti solo 'nav-link'

import "../CSS/header-footer.css"
import {useAuth} from "../context/authContext";
import {Container, Box, TextField, Button, Avatar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import logo from "../assets/images/AppLogo.png"
import DropDownMenu from "./DropDownMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFilm} from "../context/filmContext";


function Header() {
    const {isLoggedIn} = useAuth();
    const {getFilmsFromSearch} = useFilm();
    const [title, setTitle] = useState("");

    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();
        try{
            await getFilmsFromSearch(title); //ora l'array dei film ottenuti dalla ricerca viene inserito nel contesto così il componente SearchFilmResults potrà usarlo per mostrare i risultati di ricerca
            let filmTitle = title.replaceAll(" ", "-");
            navigate(`/search/${filmTitle}`); //a questo url viene renderizzato SearchFilmResults
            setTitle("");
        }catch(error){
            setTitle("");
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
                                        <Avatar alt="Travis Howard" src="../src/assets/images/logo512.png" />
                                    </li>
                                    <li>
                                        <DropDownMenu />
                                    </li>
                                    <li>
                                        <NavLink to="/archivio">Archivio</NavLink>
                                    </li>
                                    <li>
                                        <Box component="form" onSubmit={handleSearch}>
                                            <TextField type="search" id="outlined-basic" label="Cerca un film..." variant="outlined" value={title} onChange={ (e) => setTitle(e.target.value) } />
                                            <Button variant="contained" onClick={handleSearch}>
                                                <SearchIcon />
                                            </Button>
                                        </Box>
                                    </li>
                                    <li>
                                        <Button variant="contained" color="success" href="/log-a-film" style={{ textDecoration: 'none', color: "white" }}> + Log </Button>
                                    </li>
                                    <li>
                                        <Button href="/">
                                            <img src={logo} alt="logo" style={{height: '50px', width: 'auto' }}/>
                                        </Button>
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
                                        <Button variant="contained" color="success" href="/login"> Login </Button>
                                    </li>
                                    <li>
                                        <Button variant="contained" color="success" href="/registration"> Crea un Account</Button>
                                    </li>
                                    <li>
                                        <Button href="/">
                                            <img src={logo} alt="logo" style={{height: '50px', width: 'auto' }}/>
                                        </Button>
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