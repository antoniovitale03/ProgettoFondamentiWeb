import React, {useState} from "react";
import {useAuth} from "../context/authContext";
import {useNavigate} from "react-router-dom";

function DeleteAccount() {

    const [confirmEmail, setConfirmEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {user, sleep, logout} = useAuth();

    const navigate = useNavigate();

    const handleDeleteAccount = async (event) => {
        event.preventDefault()
        setError("");

        try {
            const trueEmail = user.email //trueEmail è l'effettiva mail dell'utente e la confronto con quella appena inserita
            if (trueEmail !== confirmEmail) {
                throw new Error("L'email non corrisponde a quella del tuo account. Riprova");
            }

            //se l'email corrisponde, si procede ad eliminare l'utente (tramite chiamata API al server)
            const response = await fetch("http://localhost:5001/api/delete-account", {
                method: "DELETE",
                credentials: 'include' // Invia il cookie per l'autenticazione
            });

            const data = await response.json();

            if (!response.ok) {
                const error = data.message;
                throw new Error(error);
            }
            setSuccessMessage("Eliminazione dell'account avvenuta correttamente!")
            await sleep(2000);
            navigate("/");
            logout()

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