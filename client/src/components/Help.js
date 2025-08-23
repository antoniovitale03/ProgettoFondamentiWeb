import React from "react";
import {useState} from "react";
import "../CSS/Form.css"
import {Box, Container, Typography} from "@mui/material";
function Help(){
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    return(
        <Container>
            <Box className="form-container" align="left">
                <form>
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
                        <input type="textarea" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                </form>
            </Box>
        </Container>

    )
}

export default Help;