import {Box, Container} from "@mui/material";
import {NavLink} from "react-router-dom";
//questa pagina viene usata per modifcare informazioni del profilo, come nomeutente, biografia, email, lista dei film preferiti, ma anche per eliminare l'account
function Settings(){
    return(
        <Container>
            <Box>
                <p>Impostazioni</p>
                <NavLink to="/delete-account">Elimina il tuo account </NavLink>
            </Box>
        </Container>
    )
}

export default Settings;