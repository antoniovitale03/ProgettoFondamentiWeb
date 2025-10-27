import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import React, {useState} from "react";
import {Box, Button, FormControl, Input, InputLabel, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import sleep from "../hooks/useSleep";

function RegistrationForm({ email, setEmail, setStep }) {

    const {showNotification} = useNotification();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [button, setButton] = useState("Registrati");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setButton("Verifica in corso...");
        try{
            await api.post('http://localhost:5001/api/auth/registration', { username, email, password });
            // Se la chiamata ha successo, mostra il messaggio di successo e passa al secondo step
            showNotification("Abbiamo inviato un codice di verifica alla tua mail (scade tra 1 minuto)", "success");
            await sleep(2000);
            setEmail(email);
            setStep(2);
        }catch(error){
            showNotification(error.response.data, "error")
            //in caso di errore (email o username già esistenti), mostro l'errore e resetto i dati di input
            setUsername("");
            setEmail("");
            setPassword("");
            setButton("Registrati");
        }
    }

    return (
        <Box>
            <Box component="form" onSubmit={handleSubmit}>

                    <Typography component="h2">Registrazione</Typography>
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
                {
                    button === "Registrati" ? <Button type="submit" variant="contained">{button}</Button> :
                        <Button loading variant="contained" loadingPosition="end">Verifica in corso</Button>
                }

            </Box>
            <Typography component="p" className="registration-login-link">Hai già un account? Clicca <Link to="/login" style={{ color: 'white' }}>qui</Link> per loggarti. </Typography>
        </Box>

    )
}

export default RegistrationForm;