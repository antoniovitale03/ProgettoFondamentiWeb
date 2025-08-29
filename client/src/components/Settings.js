import {NavLink} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
//questa pagina viene usata per modifcare informazioni del profilo, come nomeutente, biografia, email, lista dei film preferiti, ma anche per eliminare l'account
function Settings(){
    useDocumentTitle("Settings");
    return(
        <div>
            <p>Impostazioni per modificare nomeutente, email, eventuale biografia, film preferiti, ...</p>
            <NavLink to="/delete-account">Elimina il tuo account </NavLink>
        </div>
    )
}

export default Settings;