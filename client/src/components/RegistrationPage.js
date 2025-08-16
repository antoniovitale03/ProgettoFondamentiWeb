import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import "../CSS/Form.css"
import Footer from "./Footer";
import {useAuth} from "../context/authContext";
import useDocumentTitle from "./useDocumentTitle";
function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const sleep = (t) => new Promise(res => setTimeout(res, t))

    const navigate = useNavigate();
    const {registration} = useAuth()

    useDocumentTitle("Registrazione");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(" ")
    try{
        await registration(username, email, password)
        //Non salvo nessun token come nel caso di login
        setSuccessMessage(<>
            Registrazione avvenuta con successo!
            <br />
            Ora verrai reindirizzato alla pagina di login.
        </>)
        await sleep(3500)

        // Reindirizzo l'utente alla pagina di login
        navigate('/login', {
            replace: true,
            state: { message: 'Registrazione completata con successo! Ora puoi accedere.' }
        });
    } catch (error) {
        setError(error.message)
    }
    };


    return (
        <div className="page-container">
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Registration</h2>
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
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <button type="submit">Registrati</button>
                {successMessage && <p className="registration-success-message">{successMessage}</p>}
            </form>
        </div>
        <Footer />
        </div>
    )
}

// (?=.*\d): Deve contenere almeno un numero.
// (?=.*[a-z]): Deve contenere almeno una lettera minuscola.
// (?=.*[A-Z]): Deve contenere almeno una lettera maiuscola.
// (?=.*[!@#$%^&*]): Deve contenere almeno uno di questi caratteri speciali.
// .{8,}: Deve essere lunga almeno 8 caratteri.
export default RegistrationPage;