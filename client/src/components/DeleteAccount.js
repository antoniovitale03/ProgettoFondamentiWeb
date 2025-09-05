import React, {useState} from "react";
import {useAuth} from "../context/authContext";
import {useNavigate, NavLink} from "react-router-dom";
import {Box, FormControl, InputLabel, Typography, Input, Button} from "@mui/material";
import "../CSS/Form.css"
import api from "../api";
import {useNotification} from "../context/notificationContext";
function DeleteAccount() {

    const [confirmEmail, setConfirmEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const {showNotification} = useNotification();
    const {user, sleep, logout, deleteAccount} = useAuth();

    const navigate = useNavigate();

    const handleDeleteAccount = async (event) => {
        event.preventDefault()
        setError("");
        try {
            const trueEmail = user.email //trueEmail è l'effettiva mail dell'utente e la confronto con quella appena inserita
            if (trueEmail !== confirmEmail) {
                throw new Error("L'email non corrisponde a quella del tuo account. Riprova");
            }
            //se l'email corrisponde, si procede ad eliminare l'utente (tramite chiamata API al server)
            await api.delete('http://localhost:5001/api/auth/delete-account')
            setSuccessMessage("Eliminazione dell'account avvenuta correttamente!")
            await sleep(2000);
            logout();
            navigate("/");
        }catch(error){
            if(error.response){ //errore generato dall'endpoint API
                setError(error.message);
            }else{
                setError(error.message); //errore dovuto ad email non corrispondenti
            }
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