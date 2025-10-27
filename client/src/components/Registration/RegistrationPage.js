import React, {useState} from "react";
import "../../CSS/Form.css"
import useDocumentTitle from "../hooks/useDocumentTitle";
import {Box} from "@mui/material";
import api from "../../api";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../context/notificationContext"
import sleep from "../hooks/useSleep";
import RegistrationForm from "./RegistrationForm";
import VerificationForm from "./VerificationForm";

function RegistrationPage() {

    const navigate = useNavigate();
    const {showNotification} = useNotification();
    const [email, setEmail] = useState('');

    // Stato per controllare lo stato di registrazione (1 = inserimento dati, 2 = codice di verifica)
    const [step, setStep] = useState(1);

    useDocumentTitle("Registrazione");

    const handleVerify = async (verificationCode) => {
        try{
            await api.post(`${process.env.REACT_APP_SERVER}/api/auth/registration/verify`, {
                email, verificationCode
            });
            showNotification('Registrazione avvenuta con successo! Ora verrai reindirizzato alla pagina di login', "success");
            await sleep(2500);
            navigate('/login');
        }catch(error){
            throw error.response.data;
        }
    }


//il form cambia in base al valore di step (1 o 2)
    return (
        <Box className="sfondo">
            <Box className="page-container">
                {
                    step === 1 ?
                        <RegistrationForm email={email} setEmail={setEmail} setStep={setStep} />
                        : <VerificationForm onVerify={handleVerify} />
                }
            </Box>
        </Box>

    )
}

// (?=.*\d): Deve contenere almeno un numero.
// (?=.*[a-z]): Deve contenere almeno una lettera minuscola.
// (?=.*[A-Z]): Deve contenere almeno una lettera maiuscola.
// (?=.*[!@#$%^&*]): Deve contenere almeno uno di questi caratteri speciali.
// .{8,}: Deve essere lunga almeno 8 caratteri.
export default RegistrationPage;