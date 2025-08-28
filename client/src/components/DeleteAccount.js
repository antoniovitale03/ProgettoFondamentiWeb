import React, {useState} from "react";
import {useAuth} from "../context/authContext";
import {useNavigate, NavLink} from "react-router-dom";
import {Box, FormControl, InputLabel, Typography, Input, Button} from "@mui/material";
import "../CSS/Form.css"

function DeleteAccount() {

    const [confirmEmail, setConfirmEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {sleep, logout, deleteAccount} = useAuth();

    const navigate = useNavigate();

    const handleDeleteAccount = async (event) => {
        event.preventDefault()
        setError("");
        try {
            await deleteAccount(confirmEmail);
            setSuccessMessage("Eliminazione dell'account avvenuta correttamente!")
            await sleep(2000);
            logout();
            navigate("/");
        }catch(error){
            setError(error.message);
            setConfirmEmail("");
        }
    }


    return (
        <Box className="page-container">
            <Box className="form-container">
                <form onSubmit={handleDeleteAccount}>
                    <Typography component="h2">Elimina il tuo account</Typography>
                    {error && <Typography component="p" className="error-message">{error}</Typography>}
                    <Typography component="p">Per confermare l'eliminazione del tuo account, inserisci la tua mail</Typography>
                    <FormControl>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type="email" id="email" value={confirmEmail} placeholder="es. mario.rossi@gmail.com" onChange={(e) => setConfirmEmail(e.target.value)} required/>
                    </FormControl>
                    <Button type="submit">Conferma</Button>
                </form>
                <p></p>
                <p></p>
                <Typography component="p">Se non desideri più eliminare il tuo account, clicca <NavLink to="/">qui</NavLink> per tornare alla home</Typography>
                {successMessage && <Typography component="p" className="success-message">{successMessage}</Typography>}
            </Box>
        </Box>

    )
}

export default DeleteAccount;