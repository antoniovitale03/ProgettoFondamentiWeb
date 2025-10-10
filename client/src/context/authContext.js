import React, {createContext, useState, useContext} from 'react';
import api from "../api"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    // Funzione per aggiornare lo stato e localStorage al login

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

    // Dati e funzioni che vogliamo rendere disponibili a tutta l'app
    const value = { user, setUser, logout, isLoggedIn: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // children in questo caso è la componente App
}

// Custom hook per un accesso facilitato
export function useAuth() {
    return useContext(AuthContext)
}

