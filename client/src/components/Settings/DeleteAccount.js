import React, {useState} from "react";
import {useAuth} from "../../context/authContext";
import {useNavigate, NavLink} from "react-router-dom";
import {Box, FormControl, InputLabel, Typography, Input, Button} from "@mui/material";
import "../../CSS/Form.css"
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import sleep from "../hooks/useSleep";

function DeleteAccount() {

    const [confirmEmail, setConfirmEmail] = useState("");
    const {showNotification} = useNotification();
    const {logout} = useAuth();

    const navigate = useNavigate();

    const handleDeleteAccount = async (event) => {
        event.preventDefault();
        try {
            await api.delete(`http://localhost:5001/api/user/delete-account/${confirmEmail}`)
            showNotification("Eliminazione dell'account avvenuta correttamente!", "success");
            await sleep(2000);
            logout();
            navigate("/");
        }catch(error){
            showNotification(error.response.data, "error");
        }
    }


    return (
        <Box className="page-container">
            <Box className="form-container">
                <Box component="form" onSubmit={handleDeleteAccount}>
                    <Typography component="h2">Elimina il tuo account</Typography>
                    <Typography component="strong">Per confermare l'eliminazione del tuo account, inserisci la tua mail</Typography>
                    <FormControl>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type="email" id="email" value={confirmEmail} placeholder="es. mario.rossi@gmail.com" onChange={(e) => setConfirmEmail(e.target.value)} required/>
                    </FormControl>
                    <Button type="submit">Conferma</Button>
                </Box>
                <Typography component="p">Se non desideri più eliminare il tuo account, clicca <NavLink to="/">qui</NavLink> per tornare alla home</Typography>
            </Box>
        </Box>

    )
}

export default DeleteAccount;