import {useEffect} from "react";
import LoginPage from "./components/Login/LoginPage";
import UserPanel from "./components/UserPanel";
import DefaultPanel from "./components/DefaultPanel";
import {Navigate, Route, Routes} from "react-router-dom";
import RegistrationPage from "./components/Registration/RegistrationPage"
import {useAuth} from "./context/authContext";
import ForgotPasswordForm from "./components/Login/ForgotPasswordForm";
// la componente principale App gestisce solo il routing per il percorso protetto dell'app (accessibile solo dopo il login)
//per gestire il login uso localStorage in modo da salvare lo stato di login anche dopo aver chiuso il browser
function App() {
    const {isLoggedIn, logout} = useAuth() // Leggo lo stato di login dal contesto

    //Effetto per verificare se il token è scaduto, nel caso si procede al logout
    useEffect(() => {
        // Si mette in ascolto dell'evento "logout-event" lanciato da api.js
        // quando il refresh token fallisce, quindi esegue il logout
        window.addEventListener('logout-event', () => logout());

        // Funzione di pulizia per rimuovere l'ascoltatore
        return () => window.removeEventListener('logout-event', () => logout());
    }, [logout]);

   return(
        <Routes>
            <Route path="/registration" element={!isLoggedIn ? <RegistrationPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/*" element={isLoggedIn ? <UserPanel /> : <DefaultPanel /> } />
        </Routes>
    )
}

export default App;
