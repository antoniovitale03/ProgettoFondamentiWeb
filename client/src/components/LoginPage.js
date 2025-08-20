import React, { useState } from 'react';
import '../CSS/Form.css';
import { NavLink} from "react-router-dom";
import Footer from "./Footer";
import {useAuth} from "../context/authContext";
import useDocumentTitle from "./useDocumentTitle";
// Il componente riceve una prop 'onLoginSuccess' dal suo genitore.
// Questa è una funzione che verrà chiamata quando il login ha successo.
function LoginPage() {
    // Stato per memorizzare l'input dell'utente
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Variabile usata per fare rendering condizionale del form di login(1) o di impostazione della nuova password (2)
    const [step, setStep] = useState(1);

    const {login, forgotPassword, sleep} = useAuth() //ottieni la funzione login dal contesto

    useDocumentTitle("Login")

    // Funzione che verifica la correttezza delle credenziali inserite durante il login
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(" ");
        try{
            await login(username, password);
        } catch (error) {
            setError(error.message);
            setUsername("");
            setPassword("");
        }
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setError(" ");
        try{
            await forgotPassword(username, password, confirmPassword);
            setSuccessMessage(<>
                Password modificata correttamente!
                <br />
                Ora verrai reindirizzato alla pagina di login.
            </>);
            await sleep(2500);
            //ri-renderizzo la pagina di login con le variabili di stato iniziali
            setSuccessMessage("");
            setUsername("");
            setPassword("");
            setStep(1); //renderizzo il form di login
        } catch(error){
            setError(error.message)
            setPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <div className="page-container">
        <div className="form-container">
            <form onSubmit={step === 1 ? handleSubmit : handleForgotPassword}>
                <h2>{step === 1 ? "Login" : "Imposta una nuova password"}</h2>
                {/* Mostra il messaggio di errore solo se esiste */}
                {error && <p className="error-message">{error}</p>}

                {/*  Fase di login */}
                {step === 1 && (<>
                    <div className="form-group">
                        <label htmlFor="username">Nome Utente</label>
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    </>)}

                {/* --- Step 2: Fase di impostazione nuova password --- */}
                {step === 2 && (<>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Conferma Password</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        </>)}
                <button type="submit">{step === 1 ? "Accedi" : "Invia"}</button>
            </form>
            {/* Il bottone "Hai dimenticato la password" e il link di registrazione sono fuori dal form di login */}
            {step === 1 && (<>
                    <div className="forgot-password-container">
                        <button
                            type="button" // 'type="button"' è importante per non inviare il form
                            className="link-style-button" // Una classe per lo stile, per farlo sembrare un link
                            onClick={() =>
                            {   setError("");
                                setStep(2);
                            }} // Assegna la tua funzione all'evento onClick
                        >
                            Hai dimenticato la password?
                        </button>
                    </div>
                    <p className="registration-login-link">Se non hai ancora un account, clicca <NavLink to="/registration">qui</NavLink> per registrarti. </p>
                </>)}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
        <Footer />
        </div>
    )
}

export default LoginPage;