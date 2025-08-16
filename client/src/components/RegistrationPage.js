import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import "../CSS/Form.css"
import Footer from "./Footer";
import useDocumentTitle from "./useDocumentTitle";
function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Stato per controllare lo stato di registrazione (1 = dati, 2 = codice di verifica)
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [buttonState, setButtonState] = useState(0)
    //il bottone del form ha tre stati: 0 (registrati), 1 (verifica in corso...) e 2 (invia)

    const sleep = (t) => new Promise(res => setTimeout(res, t))

    const navigate = useNavigate();
    //const {registration} = useAuth()

    useDocumentTitle("Registrazione");


    //gestisce l'invio dei dati iniziali
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5001/api/registration/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            setButtonState(1);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            // Se la chiamata ha successo, mostra il messaggio e passa al secondo step
            await sleep(1500);
            setSuccessMessage("Abbiamo inviato un codice di verifica alla tua mail.");
            await sleep(2500);
            setStep(2);
            setButtonState(2)
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5001/api/registration/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, verificationCode }), // Invia l'email per identificare l'utente
            });
            const data = await response.json();
            if (!response.ok) {
                const error = data.message;
                throw new Error(error);
            }

            // Se il codice è corretto, mostra il messaggio finale e reindirizza
            setSuccessMessage(<>
                Registrazione avvenuta con successo!
                <br />
                Ora verrai reindirizzato alla pagina di login.
            </>);
            await sleep(3000); // Pausa per far leggere il messaggio
            navigate('/login', {
                replace: true,
                state: { message: 'Ora puoi effettuare il login.' }
            });
        } catch (err) {
            setError(err.message);
        }
    };




//il form cambia in base al valore di step (1 o 2)
    return (
        <div className="page-container">
            <div className="form-container">
                <form onSubmit={step === 1 ? handleSubmit : handleVerify}>
                    <h2>Registration</h2>
                    {/* Mostra il messaggio di errore solo se esiste */}
                    {error && <p className="error-message">{error}</p>}

                    {/*  Inserimento Dati */}
                    {step === 1 && (<>
                    <div className="form-group">
                        <label htmlFor="username">Nome Utente</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={step === 2}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={step === 2}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={step === 2}
                        />
                    </div>
                    <button type="submit">
                        {buttonState === 0 ? "Registrati" :
                            buttonState === 1 ? 'Verifica in corso...':
                                buttonState === 2 ? 'Registrati' :
                                    "Registrati"}
                    </button>
                    {successMessage && <p className="registration-success-message">{successMessage}</p>}
                        </>)}
                    {/* --- Step 2: Inserimento Codice di Verifica --- */}
                    {step === 2 && (<>
                            <div className="form-group">
                                <label htmlFor="verificationCode">Codice di Verifica</label>
                                <input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                        </div>
                        <button type="submit">
                            {buttonState === 0 ? "Registrati" :
                                buttonState === 1 ? 'Verifica in corso...':
                                    buttonState === 2 ? 'Invia' :
                                        "Registrati"
                            }
                            </button>
                        {successMessage && <p className="registration-success-message">{successMessage}</p>}
                            </>)}
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