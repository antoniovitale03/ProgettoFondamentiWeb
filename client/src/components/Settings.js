import {NavLink} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
import {Button} from "@mui/material";
import {useState} from "react";
//questa pagina viene usata per modifcare informazioni del profilo, come nomeutente, biografia, email, lista dei film preferiti, ma anche per eliminare l'account
function Settings(){
    useDocumentTitle("Settings");
    const [buttonState, setButtonState] = useState(0)

    const changeUsername = (event) => {
        event.preventDefault();
        setButtonState(1);
    }
    return(
        <div>
            <p>Impostazioni per modificare nomeutente, email, eventuale biografia, film preferiti, ...</p>
            <Button onClick={changeUsername}>Modifica il tuo nome utente</Button>
            {buttonState === 1 ?
                <p>Ciao</p>:null
            }
            <NavLink to="/delete-account">Elimina il tuo account </NavLink>
        </div>
    )
}

export default Settings;