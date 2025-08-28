import {Typography} from '@mui/material';
import "../CSS/Form.css"
import React from "react";
import useDocumentTitle from "./useDocumentTitle";
function Contact () {
    useDocumentTitle("Contact");
    return (
        <Typography variant="p">Qui inseriamo le nostre informazioni di contatto (email istituzionale del poliba) e/o un form in cui l'utente può inviarci un messaggio.</Typography>
    )
}

export default Contact;