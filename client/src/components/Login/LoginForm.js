import {Box, Button, FormControl, Input, InputLabel, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {useAuth} from "../../context/authContext";
import {useNotification} from "../../context/notificationContext";
import {NavLink} from "react-router-dom";



function LoginForm({ onForgotPassword }){

    const {login} = useAuth();
    const {showNotification} = useNotification();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Funzione che verifica la correttezza delle credenziali inserite durante il login
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await login(username, password);
        } catch (error) {
            showNotification(error.message, "error")
            setUsername("");
            setPassword("");
        }
    };

    return(
        <Box>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                    <Stack spacing={5}>
                        <FormControl>
                            <InputLabel htmlFor="username">Nome Utente</InputLabel>
                            <Input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required></Input>
                        </FormControl>
                    </Stack>
                <Button variant="contained" type="submit">Accedi</Button>
            </form>
            <Box className="forgot-password-container">
                <Button
                    type="button" // 'type="button"' è importante per non inviare il form
                    className="link-style-button" // Una classe per lo stile, per farlo sembrare un link
                    onClick={() => onForgotPassword(username)}
                >
                    Hai dimenticato la password?
                </Button>
            </Box>
            <Typography component="p" className="registration-login-link">Se non hai ancora un account, clicca <NavLink to="/registration">qui</NavLink> per registrarti. </Typography>
        </Box>
    )
}

export default LoginForm;