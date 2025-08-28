import React from "react";
import {useState} from "react";
import "../CSS/Form.css"
import {Typography} from "@mui/material";
import useDocumentTitle from "./useDocumentTitle";
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
            <div className="form-container" align="left">
                <Typography variant="h5">Contattaci per avere supporto</Typography>
                {error && <Typography variant="p" className="error-message">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Titolo</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Descrizione del problema</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <button type="submit">Invia</button>
                </form>
                {successMessage && <Typography variant="p" className="success-message">{successMessage}</Typography>}
            </div>

    )
}

export default Help;