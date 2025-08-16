import React, { useState } from 'react';
import '../CSS/Form.css';
import {NavLink} from "react-router-dom";
import Footer from "./Footer";
import {useAuth} from "../context/authContext";

// Il componente riceve una prop 'onLoginSuccess' dal suo genitore.
// Questa è una funzione che verrà chiamata quando il login ha successo.
function LoginPage() {
    // Stato per memorizzare l'input dell'utente
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth() //ottieni la funzione login dal contesto



    // Funzione che verifica la correttezza delle credenziali inserite durante il login
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(" ")
        try{
            await login(username, password);
        } catch (error) {
            setError(error.message)
        }
    };

    return (
        <div className="page-container">
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {/* Mostra il messaggio di errore solo se esiste */}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="username">Nome Utente</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Accedi</button>
            </form>
            <p className="registration-link">Se non hai ancora un account, clicca <NavLink to="/registration">qui</NavLink> per registrarti </p>
        </div>
        <Footer />
        </div>
    )
}

export default LoginPage;