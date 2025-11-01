import {MuiOtpInput} from "mui-one-time-password-input";
import React, {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {useNotification} from "../../context/notificationContext";

export default function VerificationForm({ onVerify }){

    const {showNotification} = useNotification();

    const [button, setButton] = useState("Invia");
    const [verificationCode, setVerificationCode] = useState("");

    const handleVerify = async (event) => {
        try{
            event.preventDefault();
            setButton("Verifica in corso...");
            await onVerify(verificationCode);
        }catch(error){
            showNotification(error, "error");
            setVerificationCode("");
            setButton("Invia");
        }
    };

    return (
        <Box component="form" onSubmit={handleVerify}>
            <Typography component="h3">Codice di verifica</Typography>
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
            <Button variant="contained" type="submit" endIcon={<SendIcon />} disabled={verificationCode?.length < 6}>{button}</Button>
        </Box>
    )
}