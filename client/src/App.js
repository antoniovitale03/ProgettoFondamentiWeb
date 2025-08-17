import {useEffect} from "react";
import LoginPage from "./components/LoginPage";
import UserPanel from "./components/UserPanel";
import DefaultPanel from "./components/DefaultPanel";
import {Route, Routes, Navigate} from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage"
import {useAuth} from "./context/authContext";
// la componente principale App gestisce solo il routing per il percorso protetto dell'app (accessibile solo dopo il login)
//per gestire il login uso localStorage in modo da salvare lo stato di login anche dopo aver chiuso il browser
function App() {
    const {isLoggedIn} = useAuth() // Leggi lo stato di login direttamente dal contesto
    //verifica della sessione solo al primo re-rendering dell'App, cioè dopo che eseguo il login (dipendenza da array vuoto)
    useEffect(() => {
         const checkUserSession = async () => {
             try {
                  await fetch('http://localhost:5001/api/me', {
                     method: 'GET',
                     headers: { 'Content-Type': 'application/json' },
                     credentials: 'include',
                 });
             } catch (error) {
                 console.log(error);
             }
         };
         checkUserSession()
     }, []);

   return(
        <Routes>
            <Route path="/registration" element={!isLoggedIn ? <RegistrationPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/*" element={isLoggedIn ? <UserPanel /> : <DefaultPanel />} />
        </Routes>
    )

}

export default App;
