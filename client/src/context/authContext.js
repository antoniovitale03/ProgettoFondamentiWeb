import React, {createContext, useState, useContext} from 'react';
import api from "../api"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    // Funzione per aggiornare lo stato e localStorage al login

    //inserisco la funzione di login qui cosi posso salvare l'oggetto user nel contesto
    const login = async (username, password) => {
        try{
            const response = await api.post('http://localhost:5001/api/auth/login', { username, password });

            const user = await response.data; //data contiene i dati dell'utente + accessToken (che verranno salvati nella
            // variabile di stato user e nella memoria locale del browser)

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

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

    const sleep = (t) => new Promise(res => setTimeout(res, t))


    // Dati e funzioni che vogliamo rendere disponibili a tutta l'app
    const value = { user, setUser, login, logout, isLoggedIn: !!user, sleep };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook per un accesso facilitato
export function useAuth() {
    return useContext(AuthContext)
}

