import {NavLink, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import "../CSS/Form.css"
import Footer from "./Footer";
import useDocumentTitle from "./useDocumentTitle";
import {useAuth} from "../context/authContext"
import {Button, FormControl, Input, InputLabel, Stack} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Stato per controllare lo stato di registrazione (1 = dati, 2 = codice di verifica)
    const [step, setStep] = useState(1);

    // codice inserito dall'utente (il server controllerà se corrisponde a quello inviato via mail)
    const [verificationCode, setVerificationCode] = useState('');

    //il bottone del form ha tre stati: 1 (registrati), 2 (verifica in corso...) e 3 (invia)
    const [buttonState, setButtonState] = useState(1)


    const navigate = useNavigate();
    const {registerData, verifyCode, sleep} = useAuth()

    useDocumentTitle("Registrazione");

    //gestisce l'invio dei dati iniziali
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            setButtonState(2); //-> "Verifica in corso..."
            await registerData(username, email); //controllo se l'username o l'email già esistono.
            // Se la chiamata ha successo, mostra il messaggio di successo e passa al secondo step
            setSuccessMessage("Abbiamo inviato un codice di verifica alla tua mail.");
            await sleep(2000);
            setStep(2); // -> Form di verifica del codice
            setButtonState(3) // -> "Invia"
            setSuccessMessage("");
        } catch (error) {
            //in caso di errore (email o username già esistenti), mostro l'errore e resetto i dati di input
            setError(error.message);
            setUsername("");
            setEmail("");
            setPassword("");
            setButtonState(1);
        }
    }

    const handleVerify = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await verifyCode(username, email, password, verificationCode);
            // Se il codice è corretto, mostra il messaggio finale e reindirizza
            setSuccessMessage(<>
                Registrazione avvenuta con successo!
                <br />
                Ora verrai reindirizzato alla pagina di login.
            </>);
            await sleep(2500);
            navigate('/login');
        } catch (error) {
            setVerificationCode("");
            setError(error.message);
        }
    };


//il form cambia in base al valore di step (1 o 2)
    return (
        <div className="page-container">
            <div className="form-container">
                <form onSubmit={step === 1 ? handleSubmit : handleVerify}>
                    <h2>{step === 1 ? "Registrazione" : "Verifica la tua identità"}</h2>
                    {/* Mostra il messaggio di errore solo se esiste */}
                    {error && <p className="error-message">{error}</p>}

                    {/*  Inserimento Dati */}
                    {step === 1 && (<>
                        <Stack spacing={5}>
                            <FormControl>
                                <InputLabel htmlFor="username">Nome Utente</InputLabel>
                                <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            </FormControl>

                            <FormControl>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </FormControl>

                            <FormControl>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            </FormControl>
                        </Stack>

                        </>)}
                    {/* --- Step 2: Inserimento Codice di Verifica --- */}
                    {step === 2 && (<>
                            <FormControl>
                                <InputLabel htmlFor="verificationCode">Codice di verifica</InputLabel>
                                <Input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required/>
                            </FormControl>
                    </>)}

                    {buttonState === 1 ? <Button type="submit" variant="contained">Registrati</Button> :
                    buttonState === 2 ? <Button loading variant="contained" loadingPosition="end">Verifica in corso</Button> :
                    buttonState === 3 ? <Button variant="contained" type="submit" endIcon={<SendIcon />}>Invia</Button>: "Registrati"
                    }

                </form>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {step === 1 && (<>
                        <p className="registration-login-link">Hai già un account? Clicca <NavLink to="/login">qui</NavLink> per loggarti. </p>
                    </>
                )}
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