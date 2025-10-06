import React from "react";
import {useState} from "react";
import "../CSS/Form.css"
import {Box, FormControl, InputLabel, Stack, Typography, TextField, Input, Button} from "@mui/material";
import useDocumentTitle from "./hooks/useDocumentTitle";
function Help(){
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useDocumentTitle("Help");

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        try{
            //await checkEmail(email) controlla se l'email esiste
            setSuccessMessage("Avrai una risposta entro 48 ore.")
        } catch(error){
            setError(error.message);
        }
    }
    return(
        <Box classname="page-container">
            <Box className="form-container">
                <Typography component="h5">Contattaci per avere supporto</Typography>
                {error && <Typography component="p" className="error-message">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={5}>
                        <FormControl>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="title">Titolo</InputLabel>
                            <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                        </FormControl>

                        <FormControl>
                            <TextField id="outlined-multiline-flexible" multiline rows={5} label="Descrizione del problema" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FormControl>

                    </Stack>

                    <Button type="submit">Invia</Button>
                </form>
                {successMessage && <Typography variant="p" className="success-message">{successMessage}</Typography>}
            </Box>
        </Box>
    )
}

export default Help;