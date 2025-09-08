import React, {createContext, useState, useContext} from 'react';
import api from "../api"
// Crea il contesto. Ogni componente figlio di App dovrà esportare una o più variabili/funzioni usando il contesto
//appena creato (inizialmente nullo), a patto che il componente sia incapsulato in App e qui in AuthProvider che fornisce
//le variabili e funzioni
const AuthContext = createContext(null);

//usiamo la variabile di stato user per verificare lo stato di login durante la sessione di uso dell'app, ma per rendere
//persistente lo  stato anche dopo la chiusura del browser si usa localStorage

//N.B. la variabile di stato è JS, ma quella salvata in localstorage è JSON

// Crea il componente Provider che incapsula tutti le funzioni e variabili da condividere tra i componenti figli
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    // Funzione per aggiornare lo stato e localStorage al login

    //inserisco la funzione di login qui cosi posso salvare l'oggetto user nel contesto
    const login = async (username, password) => {
         try{
             const response = await api.post('http://localhost:5001/api/auth/login', {
                 username,
                 password
             });

             const data = await response.data; //data è JSON, response è JS (contiene i dati dell'utente appena loggato)

             // Se la chiamata API ha successo, aggiorna lo stato e localStorage
             setUser(data);
             localStorage.setItem('user', JSON.stringify(data));

         }catch(error){
             throw new Error(error.response.data);
         }
    };


    // Funzione per pulire lo stato e localStorage al logout
    const logout = async () => {
            try{
                await api.post('http://localhost:5001/api/auth/logout')
            }catch(error){
                throw new Error(error.response.data);
            }
        //il server invierà un messaggio con cookie già scaduto, quindi viene scartato dal client

        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = (user) => {
        setUser(user);
    }

    const sleep = (t) => new Promise(res => setTimeout(res, t))


    // Dati e funzioni che vogliamo rendere disponibili a tutta l'app
    const value = { user, login, logout, isLoggedIn: !!user, sleep, updateUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook per un accesso facilitato
export function useAuth() {
    return useContext(AuthContext)
}


