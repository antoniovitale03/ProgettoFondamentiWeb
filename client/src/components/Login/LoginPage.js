import React, {useState} from 'react';
import '../../CSS/Form.css';
import useDocumentTitle from "../hooks/useDocumentTitle";
import {Box} from "@mui/material";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerificationForm from "../Registration/VerificationForm";
import api from "../../api"
import {useNotification} from "../../context/notificationContext";
import sleep from "../hooks/useSleep";

function LoginPage() {

    const {showNotification} = useNotification();

    //gestisco questa variabile di stato nel componente padre
    const [email, setEmail] = useState("");

    // step = 1 per il login,  step = 2 per la verifica dell'email e step = 3 per l'impostazione della nuova password
    const [step, setStep] = useState(1);

    const handleVerify = async (verificationCode) => {
        try{
            await api.post('http://localhost:5001/api/auth/login/verify', { verificationCode });
            showNotification('Codice corretto! Ora verrai reindirizzato alla pagina di reimpostazione della password', "success");
            await sleep(3000);
            setStep(3);
        }catch(error){
            throw error.response.data;
        }
    }


    useDocumentTitle("Login");

    return (
        <Box className="sfondo">
            <Box className="page-container">
                {
                    step === 1 ? <LoginForm setStep={setStep} email={email} setEmail={setEmail} /> :
                        step === 2 ? <VerificationForm onVerify={handleVerify} /> :
                            step === 3 ? <ForgotPasswordForm setStep={setStep} email={email} setEmail={setEmail} /> : null
                }
            </Box>
        </Box>
    )
}

export default LoginPage;