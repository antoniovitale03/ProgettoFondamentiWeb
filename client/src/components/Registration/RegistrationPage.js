import React, {useState} from "react";
import "../../CSS/Form.css"
import useDocumentTitle from "../useDocumentTitle";
import {Box} from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import VerificationForm from "./VerificationForm";
function RegistrationPage() {

    const [registrationData, setRegistrationData] = useState(null);

    const setData = (registrationData) => {
        setRegistrationData(registrationData);
        setStep(2);
    }

    // Stato per controllare lo stato di registrazione (1 = inserimento dati, 2 = codice di verifica)
    const [step, setStep] = useState(1);

    useDocumentTitle("Registrazione");


//il form cambia in base al valore di step (1 o 2)
    return (
            <Box className="form-container">
                {
                    step === 1 ? <RegistrationForm onSuccess={setData} /> :
                    <VerificationForm data={registrationData}/>
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