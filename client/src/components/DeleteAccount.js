import React, {useState} from "react";
import {useAuth} from "../context/authContext";
import {useNavigate} from "react-router-dom";

function DeleteAccount() {

    const [confirmEmail, setConfirmEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {sleep, logout, deleteAccount} = useAuth();

    const navigate = useNavigate();

    const handleDeleteAccount = async (event) => {
        event.preventDefault()
        setError("");
        try {
            await deleteAccount(confirmEmail);
            setSuccessMessage("Eliminazione dell'account avvenuta correttamente!")
            await sleep(2000);
            logout();
            navigate("/");
        }catch(error){
            setError(error.message);
            setConfirmEmail("");
        }
    }



    return (
        <div className="page-container">
            <div className="form-container">
                <form onSubmit={handleDeleteAccount}>
                    <h2>Elimina il tuo account</h2>
                    {error && <p className="error-message">{error}</p>}
                    <p>Per confermare l'eliminazione del tuo account, inserisci la tua mail</p>
                    <input type="email" id="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required />
                    <button type="submit">Conferma</button>
                </form>
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>

    )
}

export default DeleteAccount;