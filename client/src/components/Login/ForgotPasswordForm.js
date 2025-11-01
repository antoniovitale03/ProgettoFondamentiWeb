import {Box, Button, FormControl, Input, InputLabel, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import SendIcon from "@mui/icons-material/Send";
import useDocumentTitle from "../hooks/useDocumentTitle";
import sleep from "../hooks/useSleep";

export default function ForgotPasswordForm({ setStep, email }) {

    useDocumentTitle("Hai dimenticato la tua password?");
    const {showNotification} = useNotification();

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSetNewPassword = async (event) => {
        event.preventDefault();
        try{
            await api.post(`${process.env.REACT_APP_SERVER}/api/auth/set-new-password`, {
                email, newPassword, confirmNewPassword
            })
            showNotification("Password modificata correttamente! Ora verrai reindirizzato alla pagina di login", "success")
            await sleep(2500);
            setStep(1); //renderizzo di nuovo la pagina di login
        } catch(error){
            showNotification(error.response.data, "error");
            setNewPassword("");
            setConfirmNewPassword("");
        }
    }

    return(
        <Box component="form" onSubmit={handleSetNewPassword}>
            <Typography component="h2">Imposta la nuova password</Typography>
            <Stack spacing={5}>
                <FormControl>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input type="email" id="email" value={email} required />
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="newPassword">Nuova password</InputLabel>
                    <Input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="confirmNewPassword">Conferma nuova password</InputLabel>
                    <Input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required/>
                </FormControl>
                <Button variant="contained" type="submit" endIcon={<SendIcon />}>Invia</Button>
            </Stack>
        </Box>
    )
}