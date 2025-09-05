import {Box, Button, FormControl, Input, InputLabel, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import api from "../api";
import {useAuth} from "../context/authContext";

function ModifyPassword() {
    const {user, sleep} = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const username = user.username;

    const handleModifyPassword = async (event) => {
        event.preventDefault();
        setError(" ");
        try{
            await api.post('http://localhost:5001/api/auth/forgot-password', {
                username, oldPassword, newPassword, confirmNewPassword
            })
            setSuccessMessage("Password modificata correttamente!");
            await sleep(2500);
            //ri-renderizzo la pagina di login con le variabili di stato iniziali
            setSuccessMessage("");
        } catch(error){
            setError(error.response.data)
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        }
    }

    return(
        <Box className="page-container">
            <Box className="form-container">
                <form onSubmit={handleModifyPassword}>
                    <h1>Modifica la tua password</h1>
                    {error && <Typography component="p" className="error-message">{error}</Typography>}
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
                        <Button type="onSubmit">Invia</Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    )
}
export default ModifyPassword;