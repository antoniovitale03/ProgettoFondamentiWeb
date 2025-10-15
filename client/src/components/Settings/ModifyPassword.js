import {Box, Button, FormControl, Input, InputLabel, Stack} from "@mui/material";
import React, {useState} from "react";
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import {useNavigate} from "react-router-dom";

function ModifyPassword() {
    const navigate = useNavigate();
    const {showNotification} = useNotification();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");


    const handleModifyPassword = async (event) => {
        event.preventDefault();
        try{
            await api.post('http://localhost:5001/api/auth/modify-password', {
                oldPassword, newPassword, confirmNewPassword
            })
            showNotification("Password aggiornata correttamente", "success");
            navigate("/");
        } catch(error){
            showNotification(error.response.data, "error");
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