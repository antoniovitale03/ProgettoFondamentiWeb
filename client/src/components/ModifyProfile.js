import {Box, Button, FormControl, Input, InputLabel, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import "../CSS/Form.css"
import api from "../api";
import {useNotification} from "../context/notificationContext";
import {useAuth} from "../context/authContext";
function ModifyProfile(){

    const {showNotification} = useNotification();
    const {user} = useAuth();
    const [newUsername, setNewUsername] = useState("");
    const [newName, setNewName] = useState("");
    const [newSurname, setNewSurname] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newCountry, setNewCountry] = useState("");
    const [error, setError] = useState("");

    const handleModifyProfile = async (event) => {
        event.preventDefault();
        try{
            await api.post("http://localhost:5001/api/auth/modify-profile", {
                newUsername, newName, newSurname, newEmail, newBio, newCountry
            })
        }catch(error){
            showNotification(error.response.data, "error")
        }
    }

    return(
        <Box className="page-container">
        <Box className="form-container">
            <form onSubmit={handleModifyProfile} >
                <h1 style={{textAlign:"left"}}>Modifica il tuo profilo</h1>
                {error && <Typography component="p" className="error-message">{error}</Typography>}
                <Stack spacing={4}>
                    <FormControl>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" type="text" placeholder={user.username} value={newUsername} onChange={ e => setNewUsername(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <InputLabel>Nome</InputLabel>
                        <Input id="nome" type="text" placeholder={user.name} value={newName} onChange={ e => setNewName(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <InputLabel>Cognome</InputLabel>
                        <Input id="surname" type="text" placeholder={user.surname} value={newSurname} onChange={ e => setNewSurname(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type="email" id="email" placeholder={user.email} value={newEmail} onChange={ e => setNewEmail(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <TextField id="outlined-multiline-flexible" multiline rows={5} label="Biografia" placeholder={user.biography} value={newBio} onChange={(e) => setNewBio(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="country">Paese d'origine</InputLabel>
                        <Input type="country" id="country"  placeholder={user.country} value={newCountry} onChange={ e => setNewCountry(e.target.value)} />
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary">Salva le modifiche</Button>
                </Stack>
            </form>
        </Box>
        </Box>
    )
}
export default ModifyProfile;