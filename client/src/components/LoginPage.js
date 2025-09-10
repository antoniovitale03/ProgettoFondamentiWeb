import React, { useState } from 'react';
import '../CSS/Form.css';
import {NavLink} from "react-router-dom";
import Footer from "./Footer";
import {useAuth} from "../context/authContext";
import useDocumentTitle from "./useDocumentTitle";
import {Button, FormControl, InputLabel, Input, Stack, Box, Typography} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../api";
// Il componente riceve una prop 'onLoginSuccess' dal suo genitore.
// Questa è una funzione che verrà chiamata quando il login ha successo.
function LoginPage() {
    // Stato per memorizzare l'input dell'utente
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Variabile usata per fare rendering condizionale del form di login(1) o di impostazione della nuova password (2)
    const [step, setStep] = useState(1);

    const {login, sleep} = useAuth() //ottieni la funzione login dal contesto

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
            await api.post('http://localhost:5001/api/auth/forgot-password', {
                username, oldPassword, newPassword, confirmNewPassword
            })
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
            setError(error.response.data)
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        }
    }

    return (
        <Box className="page-container">
            <Box className="form-container">
                <form onSubmit={step === 1 ? handleSubmit : handleForgotPassword}>
                    <Typography component="h2">{ step === 1 ? "Login" : "Imposta una nuova password" }</Typography>
                    {/* Mostra il messaggio di errore solo se esiste */}
                    {error && <Typography component="p" className="error-message">{error}</Typography>}

                    {/*  Fase di login */}
                    {step === 1 ?
                        <Stack spacing={5}>
                            <FormControl>
                                <InputLabel htmlFor="username">Nome Utente</InputLabel>
                                <Input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </FormControl>

                            <FormControl>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required></Input>
                            </FormControl>
                        </Stack> : null
                    }

                    {/* --- Step 2: Fase di impostazione nuova password --- */}
                    {step === 2 ?
                        <Stack spacing={5}>
                            <FormControl>
                                <InputLabel hmtlFor="oldPassword">Vecchia password</InputLabel>
                                <Input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                            </FormControl>

                            <FormControl>
                                <InputLabel htmlFor="newPassword">Nuova password</InputLabel>
                                <Input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                            </FormControl>

                            <FormControl>
                                <InputLabel htmlFor="confirmNewPassword">Conferma nuova password</InputLabel>
                                <Input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required/>
                            </FormControl>
                        </Stack> : null
                        }

                    {/* Impostazione del bottone del form al variare di step */}
                    {step === 1 ? <Button variant="contained" type="submit">Accedi</Button>:
                        step === 2 ? <Button variant="contained" type="submit" endIcon={<SendIcon />}>Invia</Button>
                        : null}

                </form>
                {/* Il bottone "Hai dimenticato la password" e il link di registrazione sono fuori dal form di login */}
                {step === 1 && (<>
                        <Box className="forgot-password-container">
                            <Button
                                type="button" // 'type="button"' è importante per non inviare il form
                                className="link-style-button" // Una classe per lo stile, per farlo sembrare un link
                                onClick={() =>
                                {   setError("");
                                    setStep(2);
                                }} // Assegna la tua funzione all'evento onClick
                            >
                                Hai dimenticato la password?
                            </Button>
                        </Box>
                        <Typography component="p" className="registration-login-link">Se non hai ancora un account, clicca <NavLink to="/registration">qui</NavLink> per registrarti. </Typography>
                    </>)}
                {successMessage && <Typography component="p" className="success-message">{successMessage}</Typography>}
            </Box>
            <Footer />
        </Box>
    )
}

export default LoginPage;