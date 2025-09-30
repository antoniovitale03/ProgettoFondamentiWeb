import {MuiOtpInput} from "mui-one-time-password-input";
import React, {useState} from "react";
import api from "../../api";
import {useNotification} from "../../context/notificationContext";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/authContext";
import {Button} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function VerificationForm({ data }){

    const {showNotification} = useNotification();
    const navigate = useNavigate();
    const {sleep} = useAuth();

    const [verificationCode, setVerificationCode] = useState('');

    const [button, setButton] = useState("Invia");

    const handleVerify = async (event) => {
        event.preventDefault();
        try {
            await api.post('http://localhost:5001/api/auth/registration/verify', {
                username: data.username,
                email: data.email,
                password: data.password,
                verificationCode
            })
            showNotification('Registrazione avvenuta con successo! Ora verrai reindirizzato alla pagina di login.', "success");
            await sleep(2500);
            navigate('/login');
        } catch (error) {
            showNotification(error.response.data, "error")
            setVerificationCode("");
        }
    };

    return (
        <form onSubmit={handleVerify}>
            <h3>Codice di verifica</h3>
            <MuiOtpInput
                value={verificationCode}
                onChange={setVerificationCode}
                length={6}
                validateChar={ (value, index) => {return !isNaN(Number(value))} } // Accetta solo numeri
                sx={{
                    // Stile per i quadrati
                    '& .MuiInputBase-root': {
                        width: '50px',
                        height: '50px',
                    },
                    '& .MuiInputBase-input': {
                        textAlign: 'center',
                        fontSize: '1.5rem',
                    }
                }}
            />
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={verificationCode.length < 6}>{button}</Button>
        </form>
    )
}

export default VerificationForm;