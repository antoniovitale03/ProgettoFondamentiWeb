import React, {useState} from 'react';
import '../../CSS/Form.css';
import useDocumentTitle from "../useDocumentTitle";
import {Box} from "@mui/material";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import {useNavigate} from "react-router-dom";
import VerificationForm from "../Registration/VerificationForm";
import api from "../../api"
import {useNotification} from "../../context/notificationContext";
import {useAuth} from "../../context/authContext";

function LoginPage() {

    const {showNotification} = useNotification();
    const {sleep} = useAuth();

    //gestisco questa variabile di stato nel componente padre
    const [email, setEmail] = useState("");

    // step = 1 per il login,  step = 2 per la verifica dell'email e step = 3 per l'impostazione della nuova password
    const [step, setStep] = useState(1);

    const handleVerify = async (verificationCode) => {
        try{
            await api.post('http://localhost:5001/api/auth/login/verify-code', { verificationCode });
            showNotification('Codice corretto! Ora verrai reindirizzato alla pagina di reimpostazione della password', "success");
            await sleep(2000);
            setStep(3);
        }catch(error){
            throw error.response.data;
        }
    }


    useDocumentTitle("Login");

    return (
            <Box className="form-container">
                {
                    step === 1 ? <LoginForm setStep={setStep} email={email} setEmail={setEmail} /> :
                        step === 2 ? <VerificationForm onVerify={handleVerify} /> :
                            step === 3 ? <ForgotPasswordForm setStep={setStep} email={email} setEmail={setEmail} /> : null
                }
            </Box>
    )
}

export default LoginPage;