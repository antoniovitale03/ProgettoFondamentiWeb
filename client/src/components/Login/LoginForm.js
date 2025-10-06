import {Box, Button, FormControl, Input, InputLabel, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {useAuth} from "../../context/authContext";
import {useNotification} from "../../context/notificationContext";
import {NavLink} from "react-router-dom";
import api from "../../api";
import sleep from "../hooks/useSleep";


function LoginForm({  setStep, email, setEmail }) {

    const {setUser} = useAuth();
    const {showNotification} = useNotification();

    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        try{
            const response = await api.post('http://localhost:5001/api/auth/login', { email, password });
            const user = await response.data; //data contiene i dati dell'utente + accessToken (che verranno salvati nella
            // variabile di stato user e nella memoria locale del browser)

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

        } catch (error) {
            showNotification(error.response.data, "error")
            setEmail("");
            setPassword("");
        }
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            //invio la mail con il codice di verifica
            await api.post("http://localhost:5001/api/auth/forgot-password", { email });
            showNotification("Abbiamo inviato un codice di verifica alla tua mail", "success");
            setStep(2);
            await sleep(1500);
        } catch (error) {
            showNotification(error.response.data, "error")
        }
    }

    return(
        <Box>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                    <Stack spacing={5}>

                        <FormControl>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required></Input>
                        </FormControl>

                    </Stack>
                <Button variant="contained" type="submit">Accedi</Button>
            </form>

            <Box className="forgot-password-container">
                <Button className="link-style-button" onClick={handleForgotPassword} disabled={email === ""}>
                    Hai dimenticato la password?
                </Button>
            </Box>
            <Typography component="p" className="registration-login-link">Se non hai ancora un account, clicca <NavLink to="/registration">qui</NavLink> per registrarti. </Typography>
        </Box>
    )
}

export default LoginForm;