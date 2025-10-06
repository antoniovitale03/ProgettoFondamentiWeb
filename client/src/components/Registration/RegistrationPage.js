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
    const [registrationData, setRegistrationData] = useState(null);

    // Stato per controllare lo stato di registrazione (1 = inserimento dati, 2 = codice di verifica)
    const [step, setStep] = useState(1);

    useDocumentTitle("Registrazione");

    const handleVerify = async (code) => {
        try{
            await api.post('http://localhost:5001/api/auth/registration/verify', {
                username: registrationData.username,
                email: registrationData.email,
                password: registrationData.password,
                verificationCode: code
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
            <Box className="form-container">
                {
                    step === 1 ?
                        <RegistrationForm setRegistrationData={setRegistrationData} setStep={setStep} />
                        : <VerificationForm onVerify={handleVerify} />
                }
            </Box>
    )
}

// (?=.*\d): Deve contenere almeno un numero.
// (?=.*[a-z]): Deve contenere almeno una lettera minuscola.
// (?=.*[A-Z]): Deve contenere almeno una lettera maiuscola.
// (?=.*[!@#$%^&*]): Deve contenere almeno uno di questi caratteri speciali.
// .{8,}: Deve essere lunga almeno 8 caratteri.
export default RegistrationPage;