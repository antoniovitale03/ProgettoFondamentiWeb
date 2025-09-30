import React, {useEffect, useState} from 'react';
import '../../CSS/Form.css';
import useDocumentTitle from "../useDocumentTitle";
import {Box} from "@mui/material";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import {useNavigate} from "react-router-dom";
function LoginPage() {

    const navigate = useNavigate();
    const [username, setUsername] = useState(""); //variabile che verrà passata al form di impostazione della nuova password,
    //per verificare che l'email inserita è corretta.

    // step = 1 per il login e step = 2 per l'impostazione della nuova password
    const [step, setStep] = useState(1);

    useEffect(() => {
        if(step === 1) {
            navigate("/login");
        }else{
            navigate("/forgot-password/")
        }
    })

    const setData = (username) => {
        setUsername(username); //salvo l'oggetto username ricevuto da loginForm e lo salvo come variabile di stato per
        //poterlo passare a forgotPasswordForm
        setStep(2);
    }

    useDocumentTitle("Login");

    return (
            <Box className="form-container">
                {
                    step === 1 ? <LoginForm onForgotPassword={setData} /> :
                    <ForgotPasswordForm username={username} onSuccess={() => setStep(1)} />
                }
            </Box>
    )
}

export default LoginPage;