import {useEffect} from "react";
import LoginPage from "./components/Authentication/LoginPage";
import UserPanel from "./components/UserPanel";
import DefaultPanel from "./components/DefaultPanel";
import {Route, Routes, Navigate} from "react-router-dom";
import RegistrationPage from "./components/Authentication/RegistrationPage"
import {useAuth} from "./context/authContext";
// la componente principale App gestisce solo il routing per il percorso protetto dell'app (accessibile solo dopo il login)
//per gestire il login uso localStorage in modo da salvare lo stato di login anche dopo aver chiuso il browser
function App() {
    const {isLoggedIn, logout} = useAuth() // Leggi lo stato di login direttamente dal contesto

    //Effetto per verificare se il token è scaduto, nel caso si procede al logout
    useEffect(() => {
        const handleLogout = () => logout()

        // Si mette in ascolto dell'evento "logout-event" lanciato da api.js
        // quando il refresh token fallisce, quindi esegue il logout
        window.addEventListener('logout-event', handleLogout);

        // Funzione di pulizia per rimuovere l'ascoltatore
        return () => window.removeEventListener('logout-event', handleLogout);
    }, [logout]);

   return(
        <Routes>
            <Route path="/registration" element={!isLoggedIn ? <RegistrationPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/*" element={isLoggedIn ? <UserPanel /> : <DefaultPanel /> } />
        </Routes>
    )
}

export default App;
