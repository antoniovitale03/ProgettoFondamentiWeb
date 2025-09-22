import {NavLink, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import "../../CSS/Form.css"
import Footer from "../Footer";
import useDocumentTitle from "../useDocumentTitle";
import {useAuth} from "../../context/authContext"
import {Box, Button, FormControl, Input, InputLabel, Stack} from "@mui/material";
import { MuiOtpInput } from 'mui-one-time-password-input';
import SendIcon from "@mui/icons-material/Send";
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
function RegistrationPage() {
    const {showNotification} = useNotification();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Stato per controllare lo stato di registrazione (1 = dati, 2 = codice di verifica)
    const [step, setStep] = useState(1);

    // codice inserito dall'utente (il server controllerà se corrisponde a quello inviato via mail)
    const [verificationCode, setVerificationCode] = useState('');

    //il bottone del form ha tre stati: 1 (registrati), 2 (verifica in corso...) e 3 (invia)
    const [buttonState, setButtonState] = useState(1)


    const navigate = useNavigate();
    const {sleep} = useAuth()

    useDocumentTitle("Registrazione");


    //gestisce l'invio dei dati iniziali
    const handleSubmit = async (event) => {
        event.preventDefault();
        setButtonState(2);
        try{
            await api.post('http://localhost:5001/api/auth/registration/data', {
                username,
                email
            })
            // Se la chiamata ha successo, mostra il messaggio di successo e passa al secondo step
            showNotification("Abbiamo inviato un codice di verifica alla tua mail.", "success");
            await sleep(2000);
            setStep(2); // -> Form di verifica del codice
            setButtonState(3); // -> "Invia"
        }catch(error){
            showNotification(error.response.data, "error")
            //in caso di errore (email o username già esistenti), mostro l'errore e resetto i dati di input
            setUsername("");
            setEmail("");
            setPassword("");
            setButtonState(1);
        }
    }

    const handleVerify = async (event) => {
        event.preventDefault();
        try {
            await api.post('http://localhost:5001/api/auth/registration/verify', {
                username, email, password, verificationCode
            })
            showNotification(<>
                Registrazione avvenuta con successo!
                <br />
                Ora verrai reindirizzato alla pagina di login.
            </>, "success");
            await sleep(2500);
            navigate('/login');
        } catch (error) {
            showNotification(error.response.data, "error")
            setVerificationCode("");
        }
    };


//il form cambia in base al valore di step (1 o 2)
    return (
            <Box className="form-container">
                <form onSubmit={step === 1 ? handleSubmit : handleVerify}>
                    <h2>{step === 1 ? "Registrazione" : "Verifica la tua identità"}</h2>

                    {/*  Inserimento Dati */}
                    {step === 1 ?
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
                        </Stack>: null
                    }
                    {/* --- Step 2: Inserimento Codice di Verifica --- */}
                    {step === 2 ?
                            <Box>
                                <h3>Codice di verifica</h3>
                                <MuiOtpInput
                                    value={verificationCode}
                                    onChange={setVerificationCode}
                                    length={6}
                                    validateChar={ (value, index) => {return !isNaN(Number(value))} } // Accetta solo numeri
                                    sx={{
                                        // Stile per i quadrati
                                        '& .MuiInputBase-root': {
                                            width: '50px',
                                            height: '50px',
                                        },
                                        '& .MuiInputBase-input': {
                                            textAlign: 'center',
                                            fontSize: '1.5rem',
                                        }
                                    }}
                                />
                            </Box>
                        : null
                    }

                    {buttonState === 1 ? <Button type="submit" variant="contained">Registrati</Button> :
                    buttonState === 2 ? <Button loading variant="contained" loadingPosition="end">Verifica in corso</Button> :
                    buttonState === 3 ? <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={verificationCode.length < 6}>Invia</Button>: "Registrati"
                    }

                </form>
                {step === 1 ?
                        <p className="registration-login-link">Hai già un account? Clicca <NavLink to="/login">qui</NavLink> per loggarti. </p> : null}
            </Box>
    )
}

// (?=.*\d): Deve contenere almeno un numero.
// (?=.*[a-z]): Deve contenere almeno una lettera minuscola.
// (?=.*[A-Z]): Deve contenere almeno una lettera maiuscola.
// (?=.*[!@#$%^&*]): Deve contenere almeno uno di questi caratteri speciali.
// .{8,}: Deve essere lunga almeno 8 caratteri.
export default RegistrationPage;